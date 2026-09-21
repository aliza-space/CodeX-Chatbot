import { env } from "../../config/env.js";
import * as gemini from "../llm/gemini.js";
import * as openai from "../llm/openai.js";

const embedders = { gemini, openai };

export async function embedText(text) {
  const provider = embedders[env.EMBEDDING_PROVIDER];
  if (!provider) throw new Error(`Unknown embedding provider: ${env.EMBEDDING_PROVIDER}`);
  return provider.embed(text);
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
