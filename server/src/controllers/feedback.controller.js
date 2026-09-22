import Feedback from "../models/Feedback.js";
import Message from "../models/Message.js";
import UnansweredQuery from "../models/UnansweredQuery.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitFeedback = asyncHandler(async (req, res) => {
  const { messageId, rating, comment } = req.body;
  const feedback = await Feedback.findOneAndUpdate(
    { message: messageId },
    {
      message: messageId,
      user: req.user?.id,
      rating,
      comment,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Close the loop: push thumbs-down answers directly into the UnansweredQuery review queue
  if (rating === "down") {
    try {
      const assistantMessage = await Message.findById(messageId);
      if (assistantMessage) {
        const precedingUserMessage = await Message.findOne({
          conversation: assistantMessage.conversation,
          role: "user",
          createdAt: { $lte: assistantMessage.createdAt },
        }).sort({ createdAt: -1 });

        const questionText = precedingUserMessage?.content || assistantMessage.content.slice(0, 100);

        await UnansweredQuery.findOneAndUpdate(
          { feedbackMessage: messageId },
          {
            question: questionText,
            conversation: assistantMessage.conversation,
            feedbackMessage: messageId,
            source: "negative_feedback",
            feedbackComment: comment || "User gave negative feedback (thumbs down)",
            resolved: false,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    } catch (err) {
      // Non-blocking log
      console.warn("Could not log negative feedback to UnansweredQuery:", err.message);
    }
  }

  res.status(201).json({ feedback });
});
