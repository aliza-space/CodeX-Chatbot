import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import FeedbackButtons from "./FeedbackButtons.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import SuggestionChips from "./SuggestionChips.jsx";
import { useChatStore } from "../../store/chatStore.js";
import { IconCpu, IconUser, IconMap } from "../common/Icons.jsx";

export default function MessageBubble({ message, onRegenerate, onPickSuggestion }) {
  const isUser = message.role === "user";
  const openMap = useChatStore((s) => s.openMap);
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`mb-4 sm:mb-5 flex gap-2.5 sm:gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant Avatar Badge */}
      {!isUser && (
        <div className="shrink-0 pt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-primary-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <IconCpu className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className={`max-w-[92%] sm:max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Name & Timestamp Header */}
        <div className="flex items-center gap-1.5 px-1 mb-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            {isUser ? "You" : "CodeBuddy AI"}
          </span>
          <span>•</span>
          <span>{time}</span>
        </div>

        {/* Message Bubble Container */}
        <div
          className={`rounded-2xl px-4 py-3 text-[13.5px] sm:text-[14px] leading-relaxed shadow-sm transition-all break-words ${
            isUser
              ? "bg-gradient-to-r from-cyan-600 via-primary-600 to-primary-700 text-white rounded-tr-xs shadow-cyan-500/10"
              : "bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200/90 dark:border-cyan-500/20 text-slate-800 dark:text-slate-100 rounded-tl-xs backdrop-blur-md shadow-sm"
          }`}
        >
          {message.streaming && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body overflow-hidden">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: "0.5rem 0",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                          padding: "0.75rem 0.85rem",
                          maxWidth: "100%",
                          overflowX: "auto",
                          background: "#080d1a",
                          border: "1px solid rgba(56, 189, 248, 0.2)",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-slate-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-md px-1.5 py-0.5 font-mono text-[12px] font-semibold border border-transparent dark:border-cyan-500/30"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Interactive Campus Radar Trigger when campus spots are mentioned */}
          {!isUser && !message.streaming && message.content && /(cafeteria|canteen|food court|library|amphitheatre|amphi|auditorium|csm lab|csm department|campus map|directions|where is|navigate|location|hostel|stadium|ground|admin|atm|health)/i.test(message.content) && (() => {
            const c = message.content.toLowerCase();
            let destId = "csm-labs";
            let label = "GPREC Campus Radar";

            if (c.includes("food court")) { destId = "food-court"; label = "Food Court"; }
            else if (c.includes("cafeteria") || c.includes("canteen")) { destId = "cafeteria"; label = "Main Cafeteria"; }
            else if (c.includes("library")) { destId = "central-library"; label = "Central Library"; }
            else if (c.includes("amphi")) { destId = "amphitheatre"; label = "Amphitheatre"; }
            else if (c.includes("auditorium")) { destId = "auditorium"; label = "Central Auditorium"; }
            else if (c.includes("csm department") || c.includes("aiml department") || c.includes("ai & ml department")) { destId = "csm-department"; label = "CSM Department"; }
            else if (c.includes("csm") || c.includes("hackathon hub") || c.includes("intel")) { destId = "csm-labs"; label = "CSM Labs (Hackathon Hub)"; }
            else if (c.includes("girls hostel")) { destId = "girls-hostel"; label = "Girls Hostel"; }
            else if (c.includes("boys hostel") || c.includes("hostel")) { destId = "boys-hostel"; label = "Boys Hostel"; }
            else if (c.includes("stadium") || c.includes("gym")) { destId = "indoor-stadium"; label = "Indoor Stadium"; }
            else if (c.includes("ground") || c.includes("cricket")) { destId = "sports-ground"; label = "Sports Ground"; }
            else if (c.includes("admin") || c.includes("principal")) { destId = "admin-block"; label = "Admin Block"; }
            else if (c.includes("atm") || c.includes("health") || c.includes("doctor")) { destId = "atm-health"; label = "ATM & Dispensary"; }
            else { destId = null; label = "Campus Radar & Navigation"; }

            return (
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openMap(destId)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-cyan-600 to-primary-600 hover:from-cyan-500 hover:to-primary-500 shadow-sm shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <IconMap className="w-3.5 h-3.5" />
                  <span>Navigate to {label}</span>
                  <span className="font-mono text-cyan-200">→</span>
                </button>
              </div>
            );
          })()}

          {/* Feedback & Actions */}
          {!isUser && !message.streaming && message.content && (
            <FeedbackButtons
              messageId={message.dbId}
              content={message.content}
              onRegenerate={onRegenerate}
            />
          )}
        </div>

        {/* Suggestion Chips */}
        {!isUser && !message.streaming && message.suggestions && message.suggestions.length > 0 && (
          <div className="w-full mt-1.5">
            <SuggestionChips
              suggestions={message.suggestions}
              onPick={(q) => onPickSuggestion?.(q)}
            />
          </div>
        )}
      </div>

      {/* User Avatar Badge */}
      {isUser && (
        <div className="shrink-0 pt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shadow-sm ring-1 ring-slate-300/50 dark:ring-slate-700">
            <IconUser className="w-4 h-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
}