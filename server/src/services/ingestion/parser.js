import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

// Parses one source file into { title, category, tags, eventDate, status, rawText }.
// Supports the knowledge-base convention already used in your .md files:
//
//   # Title
//   **Category:** event
//   **Date:** 2026-09-24
//   **Tags:** a, b, c
//   ## Section...
//
// This is NOT YAML frontmatter — it's inline bold-labeled metadata inside the
// markdown body, so we parse it with a small regex pass instead of gray-matter's
// `---` frontmatter (gray-matter is kept for any files that DO use `---` blocks).
export async function parseFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileType = ext.replace(".", "") || "txt";

  if (fileType === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return baseMeta(filePath, data.text, "pdf");
  }

  if (fileType === "docx") {
    const mammoth = (await import("mammoth")).default;
    const { value: text } = await mammoth.extractRawText({ path: filePath });
    return baseMeta(filePath, text, "docx");
  }

  // md / txt
  const raw = await fs.readFile(filePath, "utf-8");

  if (raw.trimStart().startsWith("---")) {
    const { data, content } = matter(raw);
    return {
      title: data.title || firstHeading(content) || path.basename(filePath),
      category: normalizeCategory(data.category),
      tags: normalizeTags(data.tags),
      eventDate: data.date ? new Date(data.date) : undefined,
      status: data.status,
      rawText: content.trim(),
      fileType,
    };
  }

  return parseInlineMetadataMarkdown(raw, filePath, fileType);
}

function parseInlineMetadataMarkdown(raw, filePath, fileType) {
  const title = firstHeading(raw) || path.basename(filePath);
  const category = normalizeCategory(matchBold(raw, "Category"));
  const tags = normalizeTags(matchBold(raw, "Tags"));
  const dateStr = matchBold(raw, "Date");
  const statusStr = matchBold(raw, "Status");

  return {
    title,
    category,
    tags,
    eventDate: dateStr ? safeDate(dateStr) : undefined,
    status: statusStr,
    rawText: raw.trim(),
    fileType,
  };
}

function baseMeta(filePath, text, fileType) {
  return {
    title: path.basename(filePath),
    category: "other",
    tags: [],
    eventDate: undefined,
    status: undefined,
    rawText: text.trim(),
    fileType,
  };
}

function firstHeading(text) {
  const m = text.match(/^#\s+(.+)$/m);
  return m?.[1]?.trim();
}

function matchBold(text, label) {
  // matches: **Label:** value   (value = rest of line)
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, "i");
  const m = text.match(re);
  return m?.[1]?.trim();
}

function normalizeCategory(cat) {
  if (!cat) return "other";
  const c = cat.toLowerCase().trim();
  const allowed = ["event", "faq", "team", "resource", "rule", "about", "announcement"];
  return allowed.includes(c) ? c : "other";
}

function normalizeTags(tagStr) {
  if (!tagStr) return [];
  if (Array.isArray(tagStr)) return tagStr.map((t) => String(t).trim());
  return tagStr.split(",").map((t) => t.trim()).filter(Boolean);
}

function safeDate(str) {
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

// Infers event status from eventDate relative to "now" when not explicitly set,
// so old completed events aren't presented as upcoming.
export function inferStatus(category, eventDate, explicitStatus) {
  if (explicitStatus) return explicitStatus.toLowerCase();
  if (category !== "event" || !eventDate) return "n/a";
  const now = new Date();
  const diffDays = (eventDate - now) / 86400000;
  if (diffDays < -1) return "completed";
  if (diffDays <= 1) return "ongoing";
  return "upcoming";
}
