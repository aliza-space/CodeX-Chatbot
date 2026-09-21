// The chat endpoint streams Server-Sent Events over a POST request (needs a body
// + Authorization header), so the browser's native EventSource won't work — it
// only supports GET. We parse the SSE stream manually from a fetch() response.

export async function streamChatMessage({
  message,
  conversationId,
  guestSessionId,
  token,
  onMeta,
  onToken,
  onFinal,
  onError,
  signal,
}) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Only include conversationId/guestSessionId when they're real values —
  // sending explicit `null` fails backend validation, which expects the
  // field to be either a string or simply absent, not null.
  const body = { message };
  if (conversationId) body.conversationId = conversationId;
  if (guestSessionId) body.guestSessionId = guestSessionId;

  const res = await fetch(`${apiUrl}/api/chat`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const errBody = await res.json().catch(() => ({}));
    onError?.(errBody.error || `Request failed with status ${res.status}`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "message";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete line for next chunk

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const raw = line.slice(6).trim();
        if (!raw) continue;
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          continue;
        }
        if (currentEvent === "meta") onMeta?.(data);
        else if (currentEvent === "token") onToken?.(data.token);
        else if (currentEvent === "final") onFinal?.(data);
        else if (currentEvent === "error") onError?.(data.message);
      }
    }
  }
}