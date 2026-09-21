import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import VoiceInput from "./VoiceInput.jsx";
import SlashCommandMenu from "./SlashCommandMenu.jsx";
import QuickActionCards from "./QuickActionCards.jsx";
import HistoryPanel from "./HistoryPanel.jsx";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";

export default function ChatWindow({ variant = "widget", onOpenEventGuide }) {
  const openMap = useChatStore((s) => s.openMap);
  const {
    messages,
    isStreaming,
    sendMessage,
    regenerate,
    newChat,
    conversations,
    historyLoading,
    fetchConversations,
    openConversation,
    deleteConversation,
    conversationId,
  } = useChatStream();

  const [input, setInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load participant conversation history on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (text) => {
    const value = (text ?? input).trim();
    if (!value || isStreaming) return;
    sendMessage(value);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleHistory = () => {
    if (!historyOpen) fetchConversations();
    setHistoryOpen((o) => !o);
  };

  const showSlashMenu = input.startsWith("/") && input.length > 0;

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-white dark:bg-slate-900 ${
        variant === "widget"
          ? "h-[580px] w-[400px] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl"
          : "h-full w-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 dark:border-slate-800/90 shadow-none sm:shadow-xl"
      }`}
    >
      {/* Slide-out History Drawer for ALL participants */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        conversations={conversations}
        loading={historyLoading}
        activeId={conversationId}
        onSelect={(id) => {
          openConversation(id);
          setHistoryOpen(false);
        }}
        onDelete={deleteConversation}
      />

      {/* Top Bar / Header */}
      <div className="relative flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* History Drawer Trigger */}
          <button
            onClick={toggleHistory}
            aria-label="View chat history"
            title="Chat history"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            {conversations.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-500" />
            )}
          </button>

          {/* Official Coders' Club Logo near CodeBuddy */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-primary-500/40 bg-white shadow-sm flex items-center justify-center">
              <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"
              title="System Online"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                CodeBuddy
              </h2>
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                Active
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Coders' Club GPREC • CodeX 4.0
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Event Guide Button */}
          {onOpenEventGuide && (
            <button
              onClick={onOpenEventGuide}
              className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Open event guide"
            >
              <span>📌</span>
              <span className="text-[11px]">Guide</span>
            </button>
          )}

          {/* Campus Map & Live GPS Button */}
          <button
            onClick={() => openMap()}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-sm active:scale-95"
            title="Open GPREC Campus Map & Live Directions"
          >
            <span>🗺️</span>
            <span className="hidden sm:inline">Campus Map</span>
            <span className="sm:hidden">Map</span>
          </button>

          <button
            onClick={newChat}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 border border-slate-200 dark:border-slate-800 transition-all"
            title="Start new conversation"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-50/50 dark:bg-slate-950/40 min-h-0"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] text-center px-2 py-3 sm:py-6">
            {/* Coders' Club Logo in Welcome Hero */}
            <div className="relative mb-2 sm:mb-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ring-2 ring-primary-500/40 p-0.5 bg-white shadow-lg shadow-primary-500/20 animate-float overflow-hidden">
                <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-[12px] sm:rounded-[14px]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/80 mb-1.5 sm:mb-2">
              <span>Coders' Club GPREC Intelligence</span>
            </div>

            <h3 className="font-display font-bold text-base sm:text-xl text-slate-900 dark:text-white mb-1">
              Welcome to CodeBuddy!
            </h3>
            <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-2 leading-relaxed px-2">
              Ask anything about CodeX 4.0 rules, timelines, venue, prizes, or technical domains.
            </p>

            <QuickActionCards onPick={handleSend} />
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            onPickSuggestion={handleSend}
            onRegenerate={() => {
              const idx = messages.indexOf(m);
              const priorUser = [...messages]
                .slice(0, idx)
                .reverse()
                .find((x) => x.role === "user");
              if (priorUser) regenerate(priorUser.content);
            }}
          />
        ))}
      </div>

      {/* Bottom Input Area */}
      <div className="relative p-2 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
        {/* Slash Command Autocomplete Menu */}
        {showSlashMenu && (
          <SlashCommandMenu
            query={input}
            onPick={(cmd) => {
              setInput(cmd + " ");
              inputRef.current?.focus();
            }}
          />
        )}

        <div className="relative flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-1 sm:p-1.5 shadow-sm focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/15 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or type / for commands..."
            rows={1}
            aria-label="Message input"
            className="flex-1 resize-none bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-base sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 max-h-28 sm:max-h-32 leading-relaxed"
          />

          {/* Voice Input fills the input field so user can review and hit Enter */}
          <div className="shrink-0">
            <VoiceInput
              onResult={(text) => {
                setInput((prev) => (prev ? `${prev} ${text}` : text));
                inputRef.current?.focus();
              }}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={isStreaming || !input.trim()}
            aria-label="Send query"
            className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-30 disabled:pointer-events-none shadow-sm shadow-primary-500/30 transition-all focus:outline-none shrink-0"
          >
            {isStreaming ? (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>

        {/* Clean desktop footer info */}
        <div className="hidden sm:flex items-center justify-end mt-1 px-1 text-[11px] text-slate-400">
          <span>Press Enter to send ↵</span>
        </div>
      </div>
    </div>
  );
}