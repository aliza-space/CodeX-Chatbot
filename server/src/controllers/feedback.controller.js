import Feedback from "../models/Feedback.js";
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
  res.status(201).json({ feedback });
});
