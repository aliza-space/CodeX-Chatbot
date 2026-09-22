import mongoose from "mongoose";
import Chunk from "../../models/Chunk.js";
import { embedText } from "../embedding/embedder.js";
import { env } from "../../config/env.js";

// Hybrid retrieval: Atlas $vectorSearch for semantic similarity, combined with an
// optional metadata pre-filter (category/tags/status) for keyword-ish narrowing —
// e.g. a /events command or a detected "CodeX 4.0" entity can filter to category:"event".
export async function retrieveChunks(query, { topK = env.RAG_TOP_K, filter = {} } = {}) {
  try {
    const queryVector = await embedText(query);

    const pipeline = [
      {
        $vectorSearch: {
          index: env.VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector,
          numCandidates: Math.max(topK * 20, 100),
          limit: topK * 3, // over-fetch; reranker + threshold will trim down
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
    return retrieveChunksFallback(query, { topK });
  } catch (err) {
    console.warn("Atlas vectorSearch unavailable or index not found, using fallback:", err.message);
    return retrieveChunksFallback(query, { topK });
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

// Fallback for local dev or when Atlas Search / Embedding API is unavailable
export async function retrieveChunksFallback(query, { topK = env.RAG_TOP_K } = {}) {
  try {
    const queryVector = await embedText(query);
    const all = await Chunk.find({}).lean();
    if (all.length > 0 && all[0].embedding?.length > 0) {
      const scored = all.map((c) => ({ ...c, score: cosineSim(queryVector, c.embedding) }));
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, topK * 3);
    }
  } catch (embedErr) {
    console.warn("Embedding vector failed in fallback, using keyword matching:", embedErr.message);
  }

  // Pure keyword / regex fallback across MongoDB chunks
  try {
    const rawTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const regexList = rawTerms.map((t) => new RegExp(t, "i"));
    const matched = await Chunk.find({
      $or: [
        { text: { $in: regexList } },
        { sourceTitle: { $in: regexList } },
        { tags: { $in: rawTerms } },
      ],
    })
      .limit(topK * 3)
      .lean();

    if (matched.length > 0) {
      return matched.map((c) => ({ ...c, score: 0.82 }));
    }

    // Default return some context chunks if no keyword match
    const defaultChunks = await Chunk.find({}).limit(topK * 2).lean();
    return defaultChunks.map((c) => ({ ...c, score: 0.75 }));
  } catch (dbErr) {
    console.warn("Keyword fallback failed:", dbErr.message);
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

