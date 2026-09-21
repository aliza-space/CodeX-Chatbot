import { env } from "../../config/env.js";

// Score-based re-rank: drop below-threshold chunks, dedupe near-identical text
// (same document + overlapping content), and cap to topK.
export function rerank(chunks, { topK = env.RAG_TOP_K, minScore = env.RAG_MIN_SCORE } = {}) {
  const filtered = chunks.filter((c) => c.score >= minScore);

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
