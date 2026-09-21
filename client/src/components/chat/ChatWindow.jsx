import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import VoiceInput from "./VoiceInput.jsx";
import SlashCommandMenu from "./SlashCommandMenu.jsx";
import QuickActionCards from "./QuickActionCards.jsx";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";

export default function ChatWindow({ variant = "widget" }) {
  const stopStreaming = useChatStore((s) => s.stopStreaming);
  const {
    messages,
    isStreaming,
    sendMessage,
    regenerate,
    fetchConversations,
  } = useChatStream();

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Sync conversation history in background
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

  const showSlashMenu = input.startsWith("/") && input.length > 0;

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-white dark:bg-slate-900 ${
        variant === "widget"
          ? "h-[580px] w-[400px] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl"
          : "h-full w-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 dark:border-slate-800/90 shadow-none sm:shadow-xl"
      }`}
    >
      {/* Messages Scroll View (Clean, without duplicate subheaders) */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-50/50 dark:bg-slate-950/40 min-h-0"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] text-center px-2 py-4 sm:py-6">
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

          {isStreaming ? (
            // Stop button — shown while AI is responding
            <button
              onClick={stopStreaming}
              aria-label="Stop response"
              title="Stop response"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-500/30 transition-all focus:outline-none shrink-0"
            >
              {/* Stop square icon */}
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>
          ) : (
            // Send button — shown when idle
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send query"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-30 disabled:pointer-events-none shadow-sm shadow-primary-500/30 transition-all focus:outline-none shrink-0"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>

        {/* Clean desktop footer info */}
        <div className="hidden sm:flex items-center justify-end mt-1 px-1 text-[11px] text-slate-400">
          <span>Press Enter to send ↵</span>
        </div>
      </div>
    </div>
  );
}