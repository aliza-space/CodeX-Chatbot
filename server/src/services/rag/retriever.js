import mongoose from "mongoose";
import Chunk from "../../models/Chunk.js";
import { embedText } from "../embedding/embedder.js";
import { env } from "../../config/env.js";
import { normalizeQuery } from "./normalizer.js";

const STOPWORDS = new Set([
  "what", "are", "the", "and", "for", "who", "is", "how", "in", "of", "to", "a", "an",
  "on", "at", "by", "with", "from", "about", "me", "tell", "give", "show", "can", "you",
  "does", "do", "i", "my", "our", "we", "this", "that", "these", "those", "which", "where",
  "when", "why", "be", "been", "being", "have", "has", "had", "would", "should", "could",
  "please", "some", "any", "all"
]);

export async function retrieveChunks(query, { topK = env.RAG_TOP_K, filter = {} } = {}) {
  const cleanQuery = normalizeQuery(query || "");
  try {
    const queryVector = await embedText(cleanQuery);
    if (queryVector && queryVector.length > 0) {
      const pipeline = [
        {
          $vectorSearch: {
            index: env.VECTOR_INDEX_NAME,
            path: "embedding",
            queryVector,
            numCandidates: Math.max(topK * 20, 100),
            limit: topK * 3,
            ...(buildAtlasFilter(filter) ? { filter: buildAtlasFilter(filter) } : {}),
          },
        },
        {
          $project: {
            text: 1,
            sourceTitle: 1,
            category: 1,
            tags: 1,
            eventDate: 1,
            status: 1,
            document: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ];

      const results = await Chunk.aggregate(pipeline);
      if (results && results.length > 0) return results;
    }
    return retrieveChunksFallback(cleanQuery, { topK });
  } catch (err) {
    return retrieveChunksFallback(cleanQuery, { topK });
  }
}

function buildAtlasFilter({ category, tags, status } = {}) {
  const clauses = [];
  if (category) clauses.push({ category: { $eq: category } });
  if (status) clauses.push({ status: { $eq: status } });
  if (tags?.length) clauses.push({ tags: { $in: tags } });
  if (!clauses.length) return undefined;
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

export async function retrieveChunksFallback(query, { topK = env.RAG_TOP_K } = {}) {
  const cleanQuery = normalizeQuery(query || "").toLowerCase();
  const rawWords = cleanQuery.replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  const keywords = rawWords.filter((w) => w.length > 1 && !STOPWORDS.has(w));

  // Try vector search on loaded chunks if embeddings exist
  try {
    const queryVector = await embedText(cleanQuery);
    if (queryVector && queryVector.length > 0) {
      const allWithEmbeddings = await Chunk.find({ "embedding.0": { $exists: true } }).lean();
      if (allWithEmbeddings.length > 0) {
        const scored = allWithEmbeddings.map((c) => ({
          ...c,
          score: cosineSim(queryVector, c.embedding),
        }));
        scored.sort((a, b) => b.score - a.score);
        if (scored[0].score > 0.65) {
          return scored.slice(0, topK * 3);
        }
      }
    }
  } catch (embedErr) {
    // proceed to BM25 / keyword scoring
  }

  // Advanced BM25 / keyword relevance scoring across all chunks
  try {
    const allChunks = await Chunk.find({}).lean();
    if (!allChunks || allChunks.length === 0) return [];

    const mentionsPastEvent =
      cleanQuery.includes("galactic") ||
      cleanQuery.includes("ideasprint") ||
      cleanQuery.includes("outsyslayer") ||
      cleanQuery.includes("symposium") ||
      cleanQuery.includes("2.0") ||
      cleanQuery.includes("3.0") ||
      cleanQuery.includes("past");

    const isCodeX4Query =
      cleanQuery.includes("4.0") ||
      cleanQuery.includes("codex 4") ||
      (!mentionsPastEvent && (cleanQuery.includes("codex") || cleanQuery.includes("event") || cleanQuery.includes("prize") || cleanQuery.includes("rule") || cleanQuery.includes("register")));

    const scored = allChunks.map((chunk) => {
      let score = 0;
      const text = (chunk.text || "").toLowerCase();
      const title = (chunk.sourceTitle || "").toLowerCase();
      const tags = (chunk.tags || []).map((t) => (t || "").toLowerCase());

      // Galactic Gamble targeting
      if (cleanQuery.includes("galactic")) {
        if (title.includes("galactic gamble") || tags.includes("galactic gamble")) score += 120;
      }

      // IdeaSprint targeting
      if (cleanQuery.includes("ideasprint")) {
        if (title.includes("ideasprint") || tags.includes("ideasprint")) score += 120;
      }

      // OUTSYSLAYER targeting
      if (cleanQuery.includes("outsyslayer")) {
        if (title.includes("outsyslayer") || tags.includes("outsyslayer")) score += 120;
      }

      // Code Symposium targeting
      if (cleanQuery.includes("symposium")) {
        if (title.includes("symposium")) score += 120;
      }

      // Learning resources targeting
      if (cleanQuery.includes("resource") || cleanQuery.includes("learning") || cleanQuery.includes("dsa") || cleanQuery.includes("roadmap") || cleanQuery.includes("classes")) {
        if (title.includes("learning activities") || tags.includes("learning")) score += 90;
      }

      // Upcoming events targeting
      if (cleanQuery.includes("upcoming") || cleanQuery.includes("events coming up") || cleanQuery.includes("what events")) {
        if (title.includes("overview") || title.includes("about coders' club")) score += 80;
      }

      // Winners targeting
      if (cleanQuery.includes("winner") || cleanQuery.includes("who won")) {
        if (text.includes("winners") || text.includes("1st prize")) score += 40;
      }

      // CodeX overview targeting
      if (cleanQuery.includes("what is codex") || cleanQuery === "codex" || cleanQuery === "codex 4.0" || cleanQuery.includes("about codex") || cleanQuery.includes("overview")) {
        if (title.includes("overview") || title.includes("about codex")) score += 95;
      }

      // Coders' club overview targeting
      if (cleanQuery.includes("coders club") || cleanQuery.includes("about club") || cleanQuery.includes("join") || cleanQuery.includes("membership") || cleanQuery.includes("recruitment")) {
        if (title.includes("about coders' club") || title.includes("learning activities") || title.includes("coders-club")) score += 95;
      }

      // GPREC college overview targeting
      if (cleanQuery.includes("gprec") && (cleanQuery.includes("about") || cleanQuery.includes("what is") || cleanQuery.includes("college"))) {
        if (title.includes("about g. pulla reddy") || title.includes("gprec")) score += 95;
      }

      // CodeX 4.0 edition relevance
      if (isCodeX4Query) {
        if (title.includes("codex 4.0") || tags.includes("codex 4.0")) {
          score += 45;
        }
        if (!mentionsPastEvent && (title.includes("codex 2.0") || title.includes("codex 3.0"))) {
          score -= 35;
        }
      }

      // Check multi-word phrase matches
      if (keywords.length >= 2) {
        for (let i = 0; i < keywords.length - 1; i++) {
          const bigram = `${keywords[i]} ${keywords[i + 1]}`;
          if (text.includes(bigram)) score += 20;
          if (title.includes(bigram)) score += 35;
        }
      }

      // Keyword matches
      for (const kw of keywords) {
        if (tags.some((t) => t.includes(kw) || kw.includes(t))) {
          score += 15;
        }
        if (title.includes(kw)) {
          score += 15;
        }
        if (text.includes(kw)) {
          const count = (text.match(new RegExp(`\\b${kw}`, "gi")) || []).length;
          score += Math.min(count * 3, 20);
        }
      }

      // Specific intent boosting
      if (cleanQuery.includes("eligib") || cleanQuery.includes("rule") || cleanQuery.includes("team size") || cleanQuery.includes("format") || cleanQuery.includes("1st year") || cleanQuery.includes("first year") || cleanQuery.includes("can i join") || cleanQuery.includes("participate")) {
        if (title.includes("eligibility") || tags.includes("eligibility")) score += 80;
      }
      if (cleanQuery.includes("sponsor")) {
        if (title.includes("sponsors and partners") || tags.includes("sponsors")) score += 80;
      }
      if (cleanQuery.includes("prize") || cleanQuery.includes("perk") || cleanQuery.includes("reward") || cleanQuery.includes("50,000")) {
        if (title.includes("overview") || tags.includes("prize pool")) score += 70;
      }
      if (cleanQuery.includes("food") || cleanQuery.includes("canteen") || cleanQuery.includes("cafeteria") || cleanQuery.includes("csm") || cleanQuery.includes("lab") || cleanQuery.includes("map") || cleanQuery.includes("direction") || cleanQuery.includes("venue") || cleanQuery.includes("location")) {
        if (title.includes("campus") || title.includes("facilities") || title.includes("navigation")) score += 80;
      }
      if (cleanQuery.includes("schedule") || cleanQuery.includes("round") || cleanQuery.includes("timing") || cleanQuery.includes("timeline")) {
        if (title.includes("schedule") || title.includes("rounds")) score += 80;
      }
      if (cleanQuery.includes("register") || cleanQuery.includes("fee") || cleanQuery.includes("portal") || cleanQuery.includes("300")) {
        if (title.includes("registration") || tags.includes("registration")) score += 80;
      }
      if (cleanQuery.includes("contact") || cleanQuery.includes("phone") || cleanQuery.includes("coordinator") || cleanQuery.includes("call") || cleanQuery.includes("email") || cleanQuery.includes("/team")) {
        if (title.includes("contact") || title.includes("coordinator")) score += 80;
      }

      return {
        ...chunk,
        rawScore: score,
        score: Math.max(0.05, Math.min(score / 100, 0.98)),
      };
    });

    scored.sort((a, b) => b.rawScore - a.rawScore);
    return scored.slice(0, topK * 3);
  } catch (err) {
    console.warn("Fallback retrieval error:", err.message);
    return [];
  }
}

function cosineSim(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += (a[i] || 0) * (b[i] || 0);
    na += (a[i] || 0) * (a[i] || 0);
    nb += (b[i] || 0) * (b[i] || 0);
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}
