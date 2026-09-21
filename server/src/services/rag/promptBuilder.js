export function buildContextBlock(chunks) {
  if (!chunks.length) return "";
  return chunks
    .map((c, i) => `[Source ${i + 1}: ${c.sourceTitle}]\n${c.text}`)
    .join("\n\n---\n\n");
}

export function buildCitations(chunks) {
  return chunks.map((c) => ({
    documentTitle: c.sourceTitle,
    snippet: c.text.slice(0, 220).trim() + (c.text.length > 220 ? "…" : ""),
    chunkId: c._id,
  }));
}
