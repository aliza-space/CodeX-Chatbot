import { env } from "../../config/env.js";
import * as gemini from "../llm/gemini.js";
import * as openai from "../llm/openai.js";

const embedders = { gemini, openai };

// In-memory LRU embedding cache (keeps up to 1000 normalized queries)
const MAX_CACHE_SIZE = 1000;
const embeddingCache = new Map();

function normalizeKey(str) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function embedText(text) {
  const provider = embedders[env.EMBEDDING_PROVIDER];
  if (!provider) throw new Error(`Unknown embedding provider: ${env.EMBEDDING_PROVIDER}`);

  const cacheKey = `${env.EMBEDDING_PROVIDER}:${env.EMBEDDING_MODEL}:${normalizeKey(text)}`;
  
  if (embeddingCache.has(cacheKey)) {
    // Refresh position in Map for LRU
    const cached = embeddingCache.get(cacheKey);
    embeddingCache.delete(cacheKey);
    embeddingCache.set(cacheKey, cached);
    return cached;
  }

  const vector = await provider.embed(text);

  // Evict oldest if exceeding capacity
  if (embeddingCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = embeddingCache.keys().next().value;
    if (oldestKey) embeddingCache.delete(oldestKey);
  }

  embeddingCache.set(cacheKey, vector);
  return vector;
}

// Batches with a small delay to stay under free-tier rate limits during ingestion.
export async function embedBatch(texts, { delayMs = 150 } = {}) {
  const out = [];
  for (const t of texts) {
    out.push(await embedText(t));
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
  }
  return out;
}
