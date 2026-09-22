import { env } from "../../config/env.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function getLLMModel() {
  const m = env.LLM_MODEL;
  if (!m || m === "gemini-3.1-flash-lite" || m === "gemini-flash" || m === "default") {
    return "gemini-1.5-flash";
  }
  return m;
}

function getEmbeddingModel() {
  const m = env.EMBEDDING_MODEL;
  if (!m || m === "gemini-embedding-001" || m.includes("gemini-embedding")) {
    return "text-embedding-004";
  }
  return m;
}

function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function complete({ systemPrompt, messages }) {
  const model = getLLMModel();
  const url = `${BASE}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: toGeminiContents(messages),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
}

// Streams token-by-token via Gemini's streamGenerateContent (SSE-style chunks of JSON).
export async function streamChat({ systemPrompt, messages, onToken }) {
  const model = getLLMModel();
  const url = `${BASE}/${model}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`;
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: toGeminiContents(messages),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) throw new Error(`Gemini stream error ${res.status}: ${await res.text()}`);

  let full = "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete line for next loop
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr) continue;
      try {
        const chunk = JSON.parse(jsonStr);
        const text = chunk.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
        if (text) {
          full += text;
          onToken(text);
        }
      } catch {
        // ignore partial/malformed SSE fragments
      }
    }
  }
  return full;
}

export async function embed(text) {
  const model = getEmbeddingModel();
  const url = `${BASE}/${model}:embedContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${model}`,
      content: { parts: [{ text }] },
      outputDimensionality: env.EMBEDDING_DIMENSIONS,
    }),
  });
  if (!res.ok) {
    // Try legacy embedding-001 fallback if text-embedding-004 fails
    if (model !== "embedding-001") {
      try {
        const fallbackUrl = `${BASE}/embedding-001:embedContent?key=${env.GEMINI_API_KEY}`;
        const fallbackRes = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/embedding-001",
            content: { parts: [{ text }] },
          }),
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          return fallbackData.embedding.values;
        }
      } catch {
        // continue to throw original error below
      }
    }
    throw new Error(`Gemini embedding error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.embedding.values;
}