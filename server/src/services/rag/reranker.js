import { env } from "../../config/env.js";

<<<<<<< HEAD
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
=======
// Score-based re-rank: drop below-threshold chunks, dedupe near-identical text
// (same document + overlapping content), and cap to topK.
export function rerank(chunks, { topK = env.RAG_TOP_K, minScore = env.RAG_MIN_SCORE } = {}) {
  // Use adaptive threshold (0.30 or minScore) so fallback keyword matches are not dropped
  const threshold = Math.min(minScore ?? 0.72, 0.30);
  const filtered = chunks.filter((c) => c.score >= threshold);

  // If filtered is empty but we have candidates, fallback to top candidates
  const candidates = filtered.length > 0 ? filtered : chunks.filter((c) => c.score >= 0.15);
>>>>>>> 04c21e6827bc48647e297d4f16c6dee6797ca8e2

  const seen = new Set();
  const deduped = [];
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    const key = `${c.document || c.sourceTitle}-${(c.text || "").slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
    if (deduped.length >= topK) break;
  }

  const bestScoreOverall = chunks.length ? Math.max(...chunks.map((c) => c.score)) : 0;

  return { chunks: deduped, bestScoreOverall, isConfident: deduped.length > 0 };
}
