import { getLLM } from "../llm/index.js";
import { buildRewritePrompt } from "../../prompts/rewrite.prompt.js";

const FOLLOWUP_HINTS = ["it", "that", "this", "its", "them", "those", "he", "she", "they"];

function looksLikeFollowUp(question) {
  const lower = question.toLowerCase();
  return FOLLOWUP_HINTS.some((w) => new RegExp(`\\b${w}\\b`).test(lower)) && question.split(" ").length < 12;
}

// Only calls the LLM to rewrite when the question actually looks like a follow-up,
// to save latency/cost on the common case of a fully-formed first question.
export async function rewriteQuery({ history, latestQuestion }) {
  if (!history?.length || !looksLikeFollowUp(latestQuestion)) {
    return latestQuestion;
  }
  try {
    const llm = getLLM();
    const prompt = buildRewritePrompt({ history: history.slice(-6), latestQuestion });
    const rewritten = await llm.complete({
      systemPrompt: "You are a precise query-rewriting assistant.",
      messages: [{ role: "user", content: prompt }],
    });
    return rewritten.trim() || latestQuestion;
  } catch (err) {
    console.warn("Query rewrite fallback:", err.message);
    return latestQuestion;
  }
}
