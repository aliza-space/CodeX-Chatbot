import { useChatStore } from "../store/chatStore.js";

export function useChatStream() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const error = useChatStore((s) => s.error);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const regenerate = useChatStore((s) => s.regenerate);
  const newChat = useChatStore((s) => s.newChat);
  const conversationId = useChatStore((s) => s.conversationId);
  const loadConversation = useChatStore((s) => s.loadConversation);
  const conversations = useChatStore((s) => s.conversations);
  const historyLoading = useChatStore((s) => s.historyLoading);
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const openConversation = useChatStore((s) => s.openConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    regenerate,
    newChat,
    conversationId,
    loadConversation,
    conversations,
    historyLoading,
    fetchConversations,
    openConversation,
    deleteConversation,
  };
}