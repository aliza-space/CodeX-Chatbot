import mongoose from "mongoose";

// One chunk = one embeddable slice of a Document, with metadata copied
// down from the parent so retrieval filters don't need a $lookup.
const chunkSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true, index: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true }, // length = EMBEDDING_DIMENSIONS
    order: { type: Number, required: true }, // position within the document

    // denormalized metadata for hybrid filtering
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    sourceTitle: { type: String },
    eventDate: { type: Date },
    status: { type: String },
  },
  { timestamps: true }
);

// Atlas Vector Search index is created separately via docs/atlas-vector-index.json
// (cannot be created through Mongoose — see setup docs).

export default mongoose.model("Chunk", chunkSchema);
