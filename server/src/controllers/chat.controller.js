import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { runRagPipeline } from "../services/rag/ragPipeline.js";
import { initSSE, sendSSE, endSSE } from "../utils/sse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const streamChat = asyncHandler(async (req, res) => {
  const { message, conversationId, guestSessionId } = req.body;
  const startedAt = Date.now();

  let conversation = conversationId
    ? await Conversation.findById(conversationId)
    : await Conversation.create({
        user: req.user?.id,
        guestSessionId: req.user ? undefined : guestSessionId,
        title: message.slice(0, 60),
      });

  const previousMessages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 })
    .limit(20)
    .lean();

  const history = previousMessages.map((m) => ({ role: m.role, content: m.content }));

  await Message.create({ conversation: conversation._id, role: "user", content: message });

  initSSE(res);
  sendSSE(res, "meta", { conversationId: conversation._id });

  try {
    const result = await runRagPipeline({
      userMessage: message,
      history,
      conversationId: conversation._id,
      onToken: (token) => sendSSE(res, "token", { token }),
    });

    const assistantMessage = await Message.create({
      conversation: conversation._id,
      role: "assistant",
      content: result.answer,
      citations: result.citations,
      rewrittenQuery: result.rewrittenQuery,
      wasAnswered: result.wasAnswered,
      latencyMs: Date.now() - startedAt,
    });

    sendSSE(res, "final", {
      messageId: assistantMessage._id,
      citations: result.citations,
      suggestions: result.suggestions,
      wasAnswered: result.wasAnswered,
    });
    endSSE(res);
  } catch (err) {
    sendSSE(res, "error", { message: err.message });
    endSSE(res);
  }
});
