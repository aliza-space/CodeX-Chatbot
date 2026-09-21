import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listConversations = asyncHandler(async (req, res) => {
  let query = null;
  if (req.user?.id) {
    query = { user: req.user.id };
  } else if (req.query.guestSessionId) {
    query = { guestSessionId: req.query.guestSessionId };
  }

  if (!query) {
    return res.json({ conversations: [] });
  }

  const convos = await Conversation.find(query).sort({ updatedAt: -1 }).lean();
  res.json({ conversations: convos });
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 }).lean();
  res.json({ messages });
});

export const deleteConversation = asyncHandler(async (req, res) => {
  let filter = { _id: req.params.id };
  if (req.user?.id) {
    filter.user = req.user.id;
  }
  await Message.deleteMany({ conversation: req.params.id });
  await Conversation.findOneAndDelete(filter);
  res.json({ success: true });
});
