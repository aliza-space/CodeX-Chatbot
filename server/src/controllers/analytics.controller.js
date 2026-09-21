import Message from "../models/Message.js";
import Feedback from "../models/Feedback.js";
import UnansweredQuery from "../models/UnansweredQuery.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const [topQuestions, unanswered, feedbackStats, dailyUsage, recentFeedback] = await Promise.all([
    Message.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$content", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    UnansweredQuery.find({ resolved: false }).sort({ createdAt: -1 }).limit(50).lean(),
    Feedback.aggregate([{ $group: { _id: "$rating", count: { $sum: 1 } } }]),
    Message.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]),
    Feedback.find()
      .populate("message", "content createdAt role")
      .sort({ createdAt: -1 })
      .limit(25)
      .lean(),
  ]);

  res.json({ topQuestions, unanswered, feedbackStats, dailyUsage, recentFeedback });
});
