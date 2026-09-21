import { env } from "../../config/env.js";

// Rough token estimate: ~4 chars/token for English; good enough for chunk sizing.
const CHARS_PER_TOKEN = 4;

function estimateTokens(str) {
  return Math.ceil(str.length / CHARS_PER_TOKEN);
}

// Splits markdown on "## " section boundaries first (so a chunk never straddles
// two unrelated sections, e.g. "Prize pool" landing apart from "CodeX 4.0"),
// then packs sections into ~CHUNK_TOKENS windows with CHUNK_OVERLAP token overlap,
// splitting only a section that's larger than the window on its own.
export function chunkMarkdown(rawText, { title } = {}) {
  const maxTokens = env.CHUNK_TOKENS;
  const overlapTokens = env.CHUNK_OVERLAP;
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  const overlapChars = overlapTokens * CHARS_PER_TOKEN;

  const sections = splitBySections(rawText);
  const chunks = [];
  let current = "";

  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };

  for (const section of sections) {
    if (section.length > maxChars) {
      // section itself too big: flush what we have, then hard-wrap the section
      flush();
      chunks.push(...hardWrap(section, maxChars, overlapChars));
      continue;
    }
    if ((current + "\n\n" + section).length > maxChars) {
      flush();
      // start next chunk with overlap tail of the previous chunk for continuity
      const tail = chunks.length ? chunks[chunks.length - 1].slice(-overlapChars) : "";
      current = tail ? tail + "\n\n" + section : section;
    } else {
      current = current ? current + "\n\n" + section : section;
    }
  }
  flush();

  // prepend the document title to every chunk so entity references resolve
  // even when a chunk is retrieved without its neighbors
  return chunks.map((text, i) => ({
    text: title ? `[${title}]\n${text}` : text,
    order: i,
    estTokens: estimateTokens(text),
  }));
}

function splitBySections(text) {
  const parts = text.split(/\n(?=##\s)/g); // keep "## " as start of each section
  return parts.map((p) => p.trim()).filter(Boolean);
}

function hardWrap(text, maxChars, overlapChars) {
  const out = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    out.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start = end - overlapChars;
  }
  return out;
}
