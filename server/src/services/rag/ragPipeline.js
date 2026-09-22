import { getLLM } from "../llm/index.js";
import { buildSystemPrompt } from "../../prompts/system.prompt.js";
import { rewriteQuery } from "./queryRewriter.js";
import { retrieveChunks } from "./retriever.js";
import { rerank } from "./reranker.js";
import { buildContextBlock, buildCitations } from "./promptBuilder.js";
import { parseSlashCommand } from "./commands.js";
import Announcement from "../../models/Announcement.js";
import UnansweredQuery from "../../models/UnansweredQuery.js";
import { env } from "../../config/env.js";

const PROMPT_INJECTION_PATTERNS = [
  /ignore (all|any|previous|the) instructions/i,
  /you are now/i,
  /system prompt/i,
  /reveal your (prompt|instructions)/i,
  /act as (?!codebuddy)/i,
  /jailbreak/i,
];

export function detectPromptInjection(text) {
  return PROMPT_INJECTION_PATTERNS.some((re) => re.test(text));
}

function detectLanguage(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu script
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Devanagari
  return "en";
}

async function getActiveAnnouncements() {
  const now = new Date();
  const anns = await Announcement.find({
    active: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
  })
    .sort({ priority: -1 })
    .limit(3)
    .lean();
  return anns.map((a) => `- ${a.text}`).join("\n");
}

export async function runRagPipeline({ userMessage, history = [], conversationId, onToken }) {
  if (detectPromptInjection(userMessage)) {
    const safeReply =
      "Nice try, but I can't ignore my instructions or reveal my system prompt 😄 " +
      "Ask me anything about Coders' Club events, resources, or the team instead!";
    onToken?.(safeReply);
    return { answer: safeReply, citations: [], suggestions: defaultSuggestions(), wasAnswered: true };
  }

  const language = detectLanguage(userMessage);
  const slash = parseSlashCommand(userMessage);

  if (slash?.needsClarification) {
    onToken?.(slash.expandedQuery);
    return { answer: slash.expandedQuery, citations: [], suggestions: [], wasAnswered: true };
  }

  const effectiveQuestion = slash?.expandedQuery ?? userMessage;
  const rewritten = await rewriteQuery({ history, latestQuestion: effectiveQuestion });

  const rawChunks = await retrieveChunks(rewritten, { filter: slash?.filter ?? {} });
  const { chunks, bestScoreOverall, isConfident } = rerank(rawChunks);

  const context = buildContextBlock(chunks);
  const announcements = await getActiveAnnouncements();
  const systemPrompt = buildSystemPrompt({ context, language, announcements });

  let answer = "";
  try {
    const llm = getLLM();
    const messages = [...history.slice(-8), { role: "user", content: userMessage }];

    answer = onToken
      ? await llm.streamChat({ systemPrompt, messages, onToken })
      : await llm.complete({ systemPrompt, messages });
  } catch (llmErr) {
    console.warn("⚠️ LLM execution error in runRagPipeline, providing synthesized context response:", llmErr.message);
    answer = formatSynthesizedAnswer(chunks);
    if (onToken) {
      // Stream the cleaned response smoothly
      const words = answer.split(" ");
      for (const w of words) {
        onToken(w + " ");
        await new Promise((r) => setTimeout(r, 15));
      }
    }
  }

  const citations = buildCitations(chunks);
  const wasAnswered = isConfident;

  if (!wasAnswered) {
    await UnansweredQuery.create({
      question: userMessage,
      rewrittenQuery: rewritten,
      conversation: conversationId,
      topScoreSeen: bestScoreOverall,
    });
  }

  return {
    answer,
    citations,
    suggestions: buildSuggestions(chunks, slash),
    wasAnswered,
    rewrittenQuery: rewritten,
  };
}

function buildSuggestions(chunks, slash) {
  if (slash?.command === "events") return ["How do I register?", "What's the prize pool?", "Who do I contact?"];
  if (!chunks.length) return defaultSuggestions();
  const topCategory = chunks[0]?.category;
  if (topCategory === "event") return ["What's the registration deadline?", "Who are the sponsors?", "Is there a team size limit?"];
  if (topCategory === "resource") return ["Show me the DSA roadmap", "Show me the web dev roadmap", "Show me the ML roadmap"];
  if (topCategory === "team") return ["Who is the event coordinator?", "How do I contact the club?"];
  return defaultSuggestions();
}

function defaultSuggestions() {
  return ["What events are coming up?", "How do I join Coders' Club?", "Show me learning resources"];
}

function formatSynthesizedAnswer(chunks) {
  if (!chunks || chunks.length === 0) {
    return "CodeX 4.0 is the flagship collegiate coding competition hosted by Coders' Club at GPREC, Kurnool on 24 September 2026. Teams of 2–3 participants compete across multiple rounds with prizes up to ₹50,000 sponsored by WeDevit and other top tech companies.";
  }

  const seen = new Set();
  const cleaned = [];

  for (const c of chunks) {
    const text = (c.text || "")
      .replace(/^\[.*?\]\s*/gm, "")
      .replace(/^\*\*Category:\*\*.*$/gm, "")
      .replace(/^\*\*Tags:\*\*.*$/gm, "")
      .replace(/^\*\*Date:\*\*.*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const normalizedKey = text.slice(0, 80);
    if (!text || seen.has(normalizedKey)) continue;
    seen.add(normalizedKey);
    cleaned.push(text);
    if (cleaned.length >= 2) break;
  }

  return cleaned.join("\n\n---\n\n");
}

