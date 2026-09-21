import { env } from "../../config/env.js";

const BASE = "https://api.anthropic.com/v1/messages";

function headers() {
  return {
    "Content-Type": "application/json",
    "x-api-key": env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  };
}

export async function complete({ systemPrompt, messages }) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: env.LLM_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.map((b) => b.text).join("") ?? "";
}

export async function streamChat({ systemPrompt, messages, onToken }) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: env.LLM_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Anthropic stream error ${res.status}: ${await res.text()}`);

  let full = "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const chunk = JSON.parse(line.slice(6).trim());
        if (chunk.type === "content_block_delta" && chunk.delta?.text) {
          full += chunk.delta.text;
          onToken(chunk.delta.text);
        }
      } catch {
        // ignore partial fragments
      }
    }
  }
  return full;
}

// Anthropic has no first-party embeddings API; embedding calls should use
// EMBEDDING_PROVIDER=gemini or openai even when LLM_PROVIDER=anthropic.
export async function embed() {
  throw new Error("Anthropic has no embeddings endpoint — set EMBEDDING_PROVIDER to gemini or openai.");
}
