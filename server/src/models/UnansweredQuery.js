import mongoose from "mongoose";

const unansweredQuerySchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    rewrittenQuery: { type: String },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    feedbackMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    source: {
      type: String,
      enum: ["low_confidence", "negative_feedback"],
      default: "low_confidence",
    },
    topScoreSeen: { type: Number }, // best similarity score that still fell below threshold
    feedbackComment: { type: String },
    resolved: { type: Boolean, default: false }, // admin marks true after adding knowledge
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("UnansweredQuery", unansweredQuerySchema);
