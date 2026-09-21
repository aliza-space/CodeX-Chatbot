import { env } from "../../config/env.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function complete({ systemPrompt, messages }) {
  const url = `${BASE}/${env.LLM_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;
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
  const url = `${BASE}/${env.LLM_MODEL}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`;
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
  const url = `${BASE}/${env.EMBEDDING_MODEL}:embedContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${env.EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      outputDimensionality: env.EMBEDDING_DIMENSIONS,
    }),
  });
  if (!res.ok) throw new Error(`Gemini embedding error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.embedding.values;
}