// Deliverable #4: the exact query-rewriting prompt.
// Used to resolve follow-ups like "what about its prize?" into a standalone query
// before embedding + retrieval, using the last N turns of conversation.

export function buildRewritePrompt({ history, latestQuestion }) {
  const historyText = history
    .map((m) => `${m.role === "user" ? "User" : "CodeX Buddy"}: ${m.content}`)
    .join("\n");

  return `Rewrite the user's latest message into a fully self-contained search query,
resolving any pronouns or implicit references (like "it", "that event", "the prize")
using the conversation history below. Do not answer the question. Do not add
information that wasn't implied by the conversation. Output ONLY the rewritten
query as plain text, nothing else.

Conversation history:
${historyText || "(none — this is the first message)"}

Latest user message: "${latestQuestion}"

Rewritten standalone query:`;
}
