import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import VoiceInput from "./VoiceInput.jsx";
import SlashCommandMenu from "./SlashCommandMenu.jsx";
import QuickActionCards from "./QuickActionCards.jsx";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";
import { IconSend, IconStop, IconSparkles } from "../common/Icons.jsx";

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
      className={`relative flex flex-col overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-xl transition-colors ${
        variant === "widget"
          ? "h-[580px] w-[400px] rounded-3xl"
          : "h-full w-full rounded-none sm:rounded-3xl"
      }`}
    >
      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto p-3 sm:p-5 sm:px-6 bg-transparent min-h-0 scrollbar-thin"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] text-center px-2 py-6 sm:py-8">
            {/* Coders' Club Logo in Welcome Hero */}
            <div className="relative mb-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-2 ring-blue-500/30 p-0.5 bg-white dark:bg-slate-900 shadow-lg shadow-blue-500/10 animate-float overflow-hidden flex items-center justify-center">
                <img src="/logo.jpg" alt="Coders' Club Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>CodeX Buddy Assistant • CodeX 4.0</span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight mb-1">
              How can I help you today?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-2 leading-relaxed px-2">
              Ask anything regarding CodeX 4.0 hackathon rules, venue maps, schedules, and prizes.
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

      {/* Input Deck Area */}
      <div className="relative p-2.5 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shrink-0">
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

        <div className="relative flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1 sm:p-1.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CodeX Buddy or type / for commands..."
            rows={1}
            aria-label="Message input"
            className="flex-1 resize-none bg-transparent px-3 py-1.5 sm:py-2 text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 max-h-28 sm:max-h-32 leading-relaxed"
          />

          {/* Voice Input */}
          <div className="shrink-0">
            <VoiceInput
              onResult={(text) => {
                setInput((prev) => (prev ? `${prev} ${text}` : text));
                inputRef.current?.focus();
              }}
            />
          </div>

          {isStreaming ? (
            // Stop Streaming Button
            <button
              onClick={stopStreaming}
              aria-label="Stop response"
              title="Stop stream"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-sm shadow-rose-500/30 transition-all focus:outline-none shrink-0"
            >
              <IconStop className="w-4 h-4" />
            </button>
          ) : (
            // Send Button
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send query"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-30 disabled:pointer-events-none shadow-sm shadow-blue-500/20 transition-all focus:outline-none shrink-0 active:scale-95"
            >
              <IconSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Status Line */}
        <div className="hidden sm:flex items-center justify-between mt-1.5 px-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <IconSparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>RAG-powered live intelligence</span>
          </span>
          <span>Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
}