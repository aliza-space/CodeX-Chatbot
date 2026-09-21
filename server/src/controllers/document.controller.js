import Document from "../models/Document.js";
import { ingestFile, deleteDocument } from "../services/ingestion/ingest.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({}).sort({ updatedAt: -1 }).lean();
  res.json({ documents: docs });
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const doc = await ingestFile(req.file.path, { uploadedBy: req.user.id });
  res.status(201).json({ document: doc });
});

export const reindexDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  const updated = await ingestFile(doc.sourcePath, { uploadedBy: req.user.id });
  res.json({ document: updated });
});

export const removeDocument = asyncHandler(async (req, res) => {
  await deleteDocument(req.params.id);
  res.json({ success: true });
});
