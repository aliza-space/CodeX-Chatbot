import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble.jsx";
import VoiceInput from "./VoiceInput.jsx";
import SlashCommandMenu from "./SlashCommandMenu.jsx";
import QuickActionCards from "./QuickActionCards.jsx";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";
import { IconSend, IconStop, IconSparkles, IconCpu } from "../common/Icons.jsx";

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
      className={`relative flex flex-col overflow-hidden bg-white/80 dark:bg-[#070d1a]/85 backdrop-blur-xl transition-all ${
        variant === "widget"
          ? "h-[580px] w-[400px] rounded-2xl border border-slate-200/90 dark:border-cyan-500/20 shadow-2xl"
          : "h-full w-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 dark:border-cyan-500/20 shadow-none sm:shadow-2xl"
      }`}
    >
      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto p-3 sm:p-5 sm:px-6 bg-transparent min-h-0 scrollbar-thin"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[400px] text-center px-2 py-6 sm:py-8">
            {/* Holographic AI Core Orb Animation */}
            <div className="relative mb-3 sm:mb-4 flex items-center justify-center">
              {/* Orbital Ring 1 */}
              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-cyan-500/30 dark:border-cyan-400/30 animate-spin-slow" />
              {/* Orbital Ring 2 */}
              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-primary-500/20 dark:border-primary-400/20 animate-spin-reverse" />
              
              {/* Core Pulsing AI Orb */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-primary-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white ring-2 ring-cyan-400/40">
                <IconCpu className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
              </div>
            </div>

            {/* Neural Interface Active Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 mb-2 sm:mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>CODEX 4.0 NEURAL INTERFACE • ACTIVE</span>
            </div>

            <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900 dark:text-white tracking-tight mb-1 sm:mb-1.5">
              Welcome to CodeBuddy
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-2 leading-relaxed px-2 font-sans">
              Instant campus intelligence for CodeX 4.0 hackathon guidelines, schedule, venue maps, and team rules.
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

      {/* Floating Cyber Command Deck (Input Deck) */}
      <div className="relative p-2.5 sm:p-4 border-t border-slate-200/80 dark:border-cyan-500/20 bg-white/90 dark:bg-[#070d1a]/95 backdrop-blur-xl shrink-0">
        {/* Slash Command Autocomplete Popover */}
        {showSlashMenu && (
          <SlashCommandMenu
            query={input}
            onPick={(cmd) => {
              setInput(cmd + " ");
              inputRef.current?.focus();
            }}
          />
        )}

        <div className="relative flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-slate-50/90 dark:bg-[#0b1222]/90 p-1 sm:p-1.5 shadow-sm focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/15 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CodeBuddy or type / for commands..."
            rows={1}
            aria-label="Message input"
            className="flex-1 resize-none bg-transparent px-3 py-1.5 sm:py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 max-h-28 sm:max-h-32 leading-relaxed font-sans"
          />

          {/* Voice Input Trigger */}
          <div className="shrink-0">
            <VoiceInput
              onResult={(text) => {
                setInput((prev) => (prev ? `${prev} ${text}` : text));
                inputRef.current?.focus();
              }}
            />
          </div>

          {isStreaming ? (
            // Stop Button with Red Pulse
            <button
              onClick={stopStreaming}
              aria-label="Stop response"
              title="Stop response"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-sm shadow-rose-500/30 transition-all focus:outline-none shrink-0"
            >
              <IconStop className="w-4 h-4" />
            </button>
          ) : (
            // Futuristic Glowing Send Button
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send query"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white bg-gradient-to-r from-cyan-600 to-primary-600 hover:from-cyan-500 hover:to-primary-500 active:from-cyan-700 active:to-primary-700 disabled:opacity-30 disabled:pointer-events-none shadow-sm shadow-cyan-500/30 transition-all focus:outline-none shrink-0 active:scale-95"
            >
              <IconSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Status Line */}
        <div className="hidden sm:flex items-center justify-between mt-1.5 px-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <IconSparkles className="w-3 h-3 text-cyan-500" />
            <span>RAG Query Engine</span>
          </span>
          <span>Press Enter ↵ to execute</span>
        </div>
      </div>
    </div>
  );
}