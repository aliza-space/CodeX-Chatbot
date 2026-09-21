import { create } from "zustand";
import { streamChatMessage } from "../api/chatStream.js";
import { useAuthStore } from "./authStore.js";
import api from "../api/axios.js";

function getGuestSessionId() {
  let id = localStorage.getItem("codebuddy-guest-id");
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("codebuddy-guest-id", id);
  }
  return id;
}

export const useChatStore = create((set, get) => ({
  conversationId: null,
  messages: [],
  isStreaming: false,
  error: null,
  conversations: [],
  historyLoading: false,
  isMapOpen: false,
  mapDestinationId: null,

  openMap: (destinationId = null) => set({ isMapOpen: true, mapDestinationId: destinationId }),
  closeMap: () => set({ isMapOpen: false, mapDestinationId: null }),

  newChat: () => set({ conversationId: null, messages: [], error: null }),
  loadConversation: (conversationId, messages) => set({ conversationId, messages, error: null }),

  fetchConversations: async () => {
    set({ historyLoading: true });
    try {
      const guestId = getGuestSessionId();
      const { data } = await api.get("/api/conversations", {
        params: { guestSessionId: guestId },
      });
      set({ conversations: data.conversations || [] });
    } catch {
      // non-critical
    } finally {
      set({ historyLoading: false });
    }
  },

  deleteConversation: async (id) => {
    try {
      await api.delete(`/api/conversations/${id}`);
      set((state) => ({
        conversations: state.conversations.filter((c) => c._id !== id),
        ...(state.conversationId === id ? { conversationId: null, messages: [] } : {}),
      }));
    } catch {
      // non-critical
    }
  },

  openConversation: async (id) => {
    set({ historyLoading: true });
    try {
      const { data } = await api.get(`/api/conversations/${id}`);
      const mapped = (data.messages || []).map((m) => ({
        id: m._id,
        dbId: m._id,
        role: m.role,
        content: m.content,
        citations: m.citations || [],
        suggestions: [],
        wasAnswered: m.wasAnswered,
      }));
      set({ conversationId: id, messages: mapped, error: null });
    } catch {
      set({ error: "Could not load that conversation" });
    } finally {
      set({ historyLoading: false });
    }
  },

  sendMessage: async (text) => {
    if (!text.trim() || get().isStreaming) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", content: text };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg = { id: assistantId, role: "assistant", content: "", streaming: true, citations: [], suggestions: [] };

    set((state) => ({ messages: [...state.messages, userMsg, assistantMsg], isStreaming: true, error: null }));

    const token = useAuthStore.getState().token;

    await streamChatMessage({
      message: text,
      conversationId: get().conversationId,
      guestSessionId: getGuestSessionId(),
      token,
      onMeta: (meta) => {
        if (meta.conversationId) set({ conversationId: meta.conversationId });
      },
      onToken: (token) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m)),
        }));
      },
      onFinal: (final) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId
              ? { ...m, streaming: false, dbId: final.messageId, citations: final.citations, suggestions: final.suggestions, wasAnswered: final.wasAnswered }
              : m
          ),
          isStreaming: false,
        }));
        get().fetchConversations();
      },
      onError: (message) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, streaming: false, content: m.content || "Something went wrong. Please try again." } : m
          ),
          isStreaming: false,
          error: message,
        }));
      },
    });
  },

  regenerate: (userText) => get().sendMessage(userText),
}));
