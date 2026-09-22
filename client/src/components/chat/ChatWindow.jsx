import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import VoiceInput from "./VoiceInput.jsx";
import SlashCommandMenu from "./SlashCommandMenu.jsx";
import QuickActionCards from "./QuickActionCards.jsx";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useChatStore } from "../../store/chatStore.js";
import { useAuth } from "../../hooks/useAuth.js";
import { IconSend, IconStop, IconSparkles } from "../common/Icons.jsx";

export default function ChatWindow({ onToggleSidebar, sidebarOpen }) {
  const { user, isAuthenticated } = useAuth();
  const stopStreaming = useChatStore((s) => s.stopStreaming);
  const {
    messages,
    isStreaming,
    sendMessage,
    regenerate,
    fetchConversations,
    newChat,
  } = useChatStream();

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Dynamic time & name based personalized greeting
  const greeting = (() => {
    const hour = new Date().getHours();
    let timeOfDay = "Good evening";
    if (hour < 12) timeOfDay = "Good morning";
    else if (hour < 17) timeOfDay = "Good afternoon";

    if (isAuthenticated && user?.name) {
      const firstName = user.name.split(" ")[0];
      return `${timeOfDay}, ${firstName}`;
    }
    return "How can I help you today?";
  })();

  // Sync conversation history in background
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Smooth auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Adjust textarea height dynamically
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleSend = (text) => {
    const value = (text ?? input).trim();
    if (!value || isStreaming) return;
    sendMessage(value);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSlashMenu = input.startsWith("/") && input.length > 0;

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-white dark:bg-[#070a13] transition-colors">
      {/* 1. Top Minimalist App Bar (ChatGPT Style) */}
      <header className="h-12 sm:h-14 px-3 sm:px-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-[#070a13]/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Model Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display font-bold">CodeX Buddy</span>
            <span className="text-[10px] text-slate-400 font-mono">v4.0</span>
          </div>
        </div>

        {/* Quick New Chat Button */}
        <button
          onClick={newChat}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Start New Chat"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </header>

      {/* 2. Messages Stream Canvas (Centered max-w-3xl) */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 bg-transparent min-h-0 scrollbar-thin"
      >
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            /* Claude-Style Clean Welcome Hero */
            <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[58vh] text-center px-3 py-6">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ring-2 ring-blue-500/20 p-1 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/10 flex items-center justify-center relative">
                  <img
                    src="/logo.jpg"
                    alt="Coders' Club Logo"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {isAuthenticated && user?.name && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm uppercase">
                      {user.name[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 mb-3 shadow-xs">
                <IconSparkles className="w-3.5 h-3.5" />
                <span>24/7 AI Event Assistant • Coders' Club GPREC</span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight mb-2">
                {greeting}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mb-4 leading-relaxed">
                {isAuthenticated && user?.name
                  ? "What would you like to explore about CodeX 4.0, your team rules, event rounds, or campus navigation today?"
                  : "Ask anything about the CodeX 4.0 Hackathon, team rules, registration fees, cash prizes, or get interactive campus walking directions."}
              </p>

              <QuickActionCards onPick={handleSend} />
            </div>
          ) : (
            /* Message Stream */
            <div className="space-y-4 sm:space-y-6 pb-24">
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
          )}
        </div>
      </div>

      {/* 3. Floating ChatGPT-Style Prompt Bar Deck */}
      <div className="sticky bottom-0 w-full px-3 sm:px-6 pb-3 sm:pb-5 pt-2 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#070a13] dark:via-[#070a13]/90 dark:to-transparent z-30 shrink-0">
        <div className="max-w-3xl mx-auto w-full relative">
          {/* Slash Command Autocomplete Popover */}
          {showSlashMenu && (
            <div className="absolute bottom-full mb-2 left-0 right-0 z-40">
              <SlashCommandMenu
                query={input}
                onPick={(cmd) => {
                  setInput(cmd + " ");
                  textareaRef.current?.focus();
                }}
              />
            </div>
          )}

          {/* Floating Prompt Bar Box */}
          <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-xl p-2 sm:p-2.5 flex items-end gap-2 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            {/* Slash Trigger Shortcut */}
            <button
              type="button"
              onClick={() => {
                setInput((prev) => (prev.startsWith("/") ? prev : "/" + prev));
                textareaRef.current?.focus();
              }}
              title="Slash Commands (/)"
              className="p-2 rounded-2xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 font-mono text-sm font-bold"
            >
              /
            </button>

            {/* Expanding Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask CodeX Buddy or type / for commands..."
              rows={1}
              aria-label="Message input"
              className="flex-1 resize-none bg-transparent py-2 px-1 text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 max-h-36 leading-relaxed"
            />

            {/* Voice Input Microphone */}
            <div className="shrink-0 pb-0.5">
              <VoiceInput
                onResult={(text) => {
                  setInput((prev) => (prev ? `${prev} ${text}` : text));
                  textareaRef.current?.focus();
                }}
              />
            </div>

            {/* Circular Send / Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                aria-label="Stop response"
                title="Stop stream"
                className="w-9 h-9 rounded-2xl text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-sm shadow-rose-500/30 flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <IconStop className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send query (Enter)"
                className="w-9 h-9 rounded-2xl text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-25 disabled:pointer-events-none shadow-sm shadow-blue-500/25 flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-95"
              >
                <IconSend className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Micro Footer Disclaimer */}
          <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2 select-none">
            CodeX Buddy is grounded in official GPREC Coders' Club documents. • Developed By{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">Aliza Juhaina</span>
          </p>
        </div>
      </div>
    </div>
  );
}