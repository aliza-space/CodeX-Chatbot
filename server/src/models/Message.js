import mongoose from "mongoose";

const citationSchema = new mongoose.Schema(
  {
    documentTitle: String,
    snippet: String,
    chunkId: { type: mongoose.Schema.Types.ObjectId, ref: "Chunk" },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    citations: [citationSchema],
    rewrittenQuery: { type: String }, // for user messages, after query rewriting
    wasAnswered: { type: Boolean, default: true }, // false => logged to UnansweredQuery
    latencyMs: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
