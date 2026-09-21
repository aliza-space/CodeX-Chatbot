import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: String, enum: ["up", "down"], required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
