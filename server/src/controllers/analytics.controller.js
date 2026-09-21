import Message from "../models/Message.js";
import Feedback from "../models/Feedback.js";
import UnansweredQuery from "../models/UnansweredQuery.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    users,
    totalQueries,
    todayQueries,
    totalConversations,
    topQuestions,
    unanswered,
    feedbackStats,
    dailyUsage,
    recentFeedback,
    recentQueries,
  ] = await Promise.all([
    // Real-time live count of users registered in MongoDB
    User.countDocuments(),
    // List of registered accounts (omitting sensitive password hashes)
    User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
    // Total user query messages
    Message.countDocuments({ role: "user" }),
    // User query messages logged today
    Message.countDocuments({ role: "user", createdAt: { $gte: todayStart } }),
    // Total conversation threads
    Conversation.countDocuments(),
    // Frequently asked questions
    Message.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$content", count: { $sum: 1 }, lastAsked: { $max: "$createdAt" } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
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
    // Live stream of real user queries happening at user end
    Message.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),
  ]);

  res.json({
    totalUsers,
    users,
    totalQueries,
    todayQueries,
    totalConversations,
    topQuestions,
    unanswered,
    feedbackStats,
    dailyUsage,
    recentFeedback,
    recentQueries,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting their own currently logged-in account
  if (id === req.user.id) {
    return res.status(400).json({ error: "You cannot delete your own admin account while logged in" });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "User deleted successfully", id });
});

