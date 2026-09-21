import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for guest sessions
    guestSessionId: { type: String, index: true },
    title: { type: String, default: "New chat" },
    language: { type: String, enum: ["en", "te", "hi"], default: "en" },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
