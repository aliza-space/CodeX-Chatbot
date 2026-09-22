import { env } from "../../config/env.js";

// Category-specific adaptive confidence thresholds
// High-stakes data (rules, team contacts) requires higher precision than general resources.
const CATEGORY_THRESHOLDS = {
  team: 0.78,
  rule: 0.76,
  event: 0.72,
  about: 0.70,
  faq: 0.70,
  resource: 0.68,
  campus: 0.68,
};

export function getCategoryThreshold(category) {
  if (!category) return env.RAG_MIN_SCORE;
  const cat = category.toLowerCase().trim();
  return CATEGORY_THRESHOLDS[cat] ?? env.RAG_MIN_SCORE;
}

// Score-based re-rank: drop below adaptive-threshold chunks, dedupe near-identical text, and cap to topK.
export function rerank(chunks, { topK = env.RAG_TOP_K, minScore } = {}) {
  const filtered = chunks.filter((c) => {
    const threshold = minScore !== undefined ? minScore : getCategoryThreshold(c.category);
    return c.score >= threshold;
  });

  const seen = new Set();
  const deduped = [];
  for (const c of filtered.sort((a, b) => b.score - a.score)) {
    const key = `${c.document}-${c.text.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
    if (deduped.length >= topK) break;
  }

  const bestScoreOverall = chunks.length ? Math.max(...chunks.map((c) => c.score)) : 0;

  return { chunks: deduped, bestScoreOverall, isConfident: deduped.length > 0 };
}
