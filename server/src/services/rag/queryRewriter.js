import { getLLM } from "../llm/index.js";
import { buildRewritePrompt } from "../../prompts/rewrite.prompt.js";
import { normalizeQuery } from "./normalizer.js";

const FOLLOWUP_HINTS = [
  "it", "that", "this", "its", "them", "those", "he", "she", "they",
  "winners", "who won", "winner", "prizes", "prize", "timing", "time",
  "when", "where", "how much", "fee", "cost", "rules", "rule", "eligible",
  "why", "how", "format", "rounds", "speaker", "who", "more"
];

const KNOWN_ENTITIES = [
  "galactic gamble",
  "codex 4.0",
  "codex 2.0",
  "codex 3.0",
  "ideasprint",
  "outsyslayer",
  "code symposium 2k24",
  "code symposium 2k26",
  "dodagatta nihar",
  "wedevit",
  "microcare",
  "havemore",
  "csm labs",
  "food court",
  "cafeteria",
  "amphitheatre",
  "library",
  "auditorium",
  "learning resources",
  "classes",
  "registration"
];

function extractTopicFromHistory(history = []) {
  if (!history || history.length === 0) return null;

  // Scan backwards through previous conversation turns
  for (let i = history.length - 1; i >= 0; i--) {
    const content = (history[i]?.content || "").toLowerCase();
    for (const entity of KNOWN_ENTITIES) {
      if (content.includes(entity)) {
        return entity;
      }
    }
  }
  return null;
}

function looksLikeFollowUp(question) {
  const words = question.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length <= 4) return true;
  return FOLLOWUP_HINTS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(question));
}

export async function rewriteQuery({ history = [], latestQuestion = "" }) {
  const normalized = normalizeQuery(latestQuestion);

  if (!history || history.length === 0) {
    return normalized;
  }

  // If it's a follow-up query
  if (looksLikeFollowUp(normalized)) {
    // 1. Try smart local context extraction first
    const previousTopic = extractTopicFromHistory(history);
    let contextualized = normalized;
    if (previousTopic && !normalized.toLowerCase().includes(previousTopic)) {
      contextualized = `${previousTopic} ${normalized}`;
    }

    // 2. Try LLM rewrite if available
    try {
      const llm = getLLM();
      const prompt = buildRewritePrompt({ history: history.slice(-6), latestQuestion: normalized });
      const rewritten = await llm.complete({
        systemPrompt: "You are a precise query-rewriting assistant.",
        messages: [{ role: "user", content: prompt }],
      });
      if (rewritten && rewritten.trim().length > 0 && !rewritten.includes("API key")) {
        return normalizeQuery(rewritten.trim());
      }
    } catch {
      // Use contextualized fallback
    }

    return contextualized;
  }

  return normalized;
}
