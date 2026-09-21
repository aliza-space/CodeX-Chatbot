import Document from "../../models/Document.js";
import Chunk from "../../models/Chunk.js";
import { parseFile, inferStatus } from "./parser.js";
import { chunkMarkdown } from "./chunker.js";
import { embedBatch } from "../embedding/embedder.js";
import { logger } from "../../utils/logger.js";

// Ingests a single file path: creates/updates its Document, deletes old chunks,
// re-chunks + re-embeds, and saves fresh Chunks. Safe to call again for re-indexing.
export async function ingestFile(filePath, { uploadedBy } = {}) {
  const parsed = await parseFile(filePath);
  const status = inferStatus(parsed.category, parsed.eventDate, parsed.status);

  let doc = await Document.findOne({ sourcePath: filePath });
  if (doc) {
    Object.assign(doc, {
      title: parsed.title,
      category: parsed.category,
      tags: parsed.tags,
      eventDate: parsed.eventDate,
      status,
      rawText: parsed.rawText,
      fileType: parsed.fileType,
    });
  } else {
    doc = new Document({
      title: parsed.title,
      sourcePath: filePath,
      category: parsed.category,
      tags: parsed.tags,
      eventDate: parsed.eventDate,
      status,
      rawText: parsed.rawText,
      fileType: parsed.fileType,
      uploadedBy,
    });
  }
  await doc.save();

  // wipe old chunks for this doc before re-indexing
  await Chunk.deleteMany({ document: doc._id });

  const rawChunks = chunkMarkdown(parsed.rawText, { title: parsed.title });
  const embeddings = await embedBatch(rawChunks.map((c) => c.text));

  const chunkDocs = rawChunks.map((c, i) => ({
    document: doc._id,
    text: c.text,
    embedding: embeddings[i],
    order: c.order,
    category: doc.category,
    tags: doc.tags,
    sourceTitle: doc.title,
    eventDate: doc.eventDate,
    status: doc.status,
  }));

  await Chunk.insertMany(chunkDocs);

  doc.chunkCount = chunkDocs.length;
  doc.lastIndexedAt = new Date();
  await doc.save();

  logger.info(`Ingested "${doc.title}" -> ${chunkDocs.length} chunks`);
  return doc;
}

export async function deleteDocument(documentId) {
  await Chunk.deleteMany({ document: documentId });
  await Document.findByIdAndDelete(documentId);
}
