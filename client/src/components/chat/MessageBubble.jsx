import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import FeedbackButtons from "./FeedbackButtons.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import SuggestionChips from "./SuggestionChips.jsx";
import { useChatStore } from "../../store/chatStore.js";

export default function MessageBubble({ message, onRegenerate, onPickSuggestion }) {
  const isUser = message.role === "user";
  const openMap = useChatStore((s) => s.openMap);
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`mb-3.5 sm:mb-5 flex gap-2 sm:gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant Avatar with Coders' Club Logo */}
      {!isUser && (
        <div className="shrink-0 pt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden ring-2 ring-primary-500/40 bg-white shadow-sm flex items-center justify-center">
            <img src="/logo.jpg" alt="Coders' Club" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className={`max-w-[90%] sm:max-w-[78%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Name & Time Header */}
        <div className="flex items-center gap-1.5 px-1 mb-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            {isUser ? "You" : "CodeBuddy"}
          </span>
          <span>•</span>
          <span>{time}</span>
        </div>

        {/* Message Bubble Container */}
        <div
          className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13.5px] sm:text-[14px] leading-relaxed shadow-sm transition-all break-words ${
            isUser
              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-tr-sm shadow-primary-500/10"
              : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm"
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
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 rounded-md px-1.5 py-0.5 font-mono text-[12px] font-semibold"
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

          {/* Intelligent Campus Map Trigger when locations are discussed */}
          {!isUser && !message.streaming && message.content && /(cafeteria|canteen|food court|library|amphitheatre|amphi|auditorium|csm lab|csm department|campus map|directions|where is|navigate|location|hostel|stadium|ground|admin|atm|health)/i.test(message.content) && (() => {
            const c = message.content.toLowerCase();
            let destId = "csm-labs";
            let label = "GPREC Campus Map";
            let icon = "🗺️";

            if (c.includes("food court")) { destId = "food-court"; label = "Food Court"; icon = "🍕"; }
            else if (c.includes("cafeteria") || c.includes("canteen")) { destId = "cafeteria"; label = "Main Cafeteria"; icon = "🍽️"; }
            else if (c.includes("library")) { destId = "central-library"; label = "Central Library"; icon = "📚"; }
            else if (c.includes("amphi")) { destId = "amphitheatre"; label = "Amphitheatre"; icon = "🎪"; }
            else if (c.includes("auditorium")) { destId = "auditorium"; label = "Central Auditorium"; icon = "🎭"; }
            else if (c.includes("csm department") || c.includes("aiml department") || c.includes("ai & ml department")) { destId = "csm-department"; label = "CSM Department"; icon = "🏢"; }
            else if (c.includes("csm") || c.includes("hackathon hub") || c.includes("intel")) { destId = "csm-labs"; label = "CSM Labs (Hackathon Hub)"; icon = "💻"; }
            else if (c.includes("girls hostel")) { destId = "girls-hostel"; label = "Girls Hostel"; icon = "🏡"; }
            else if (c.includes("boys hostel") || c.includes("hostel")) { destId = "boys-hostel"; label = "Boys Hostel"; icon = "🏢"; }
            else if (c.includes("stadium") || c.includes("gym")) { destId = "indoor-stadium"; label = "Indoor Stadium"; icon = "🏸"; }
            else if (c.includes("ground") || c.includes("cricket")) { destId = "sports-ground"; label = "Sports Ground"; icon = "🏏"; }
            else if (c.includes("admin") || c.includes("principal")) { destId = "admin-block"; label = "Admin Block"; icon = "🏛️"; }
            else if (c.includes("atm") || c.includes("health") || c.includes("doctor")) { destId = "atm-health"; label = "ATM & Dispensary"; icon = "🏥"; }
            else { destId = null; label = "Campus Map & Wayfinding"; icon = "🗺️"; }

            return (
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openMap(destId)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-sm shadow-primary-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-sm">{icon}</span>
                  <span>Open {label} with Live Compass ➔</span>
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
          <div className="w-full">
            <SuggestionChips
              suggestions={message.suggestions}
              onPick={(q) => onPickSuggestion?.(q)}
            />
          </div>
        )}
      </div>

      {/* User Initial / Avatar */}
      {isUser && (
        <div className="shrink-0 pt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm">
            👤
          </div>
        </div>
      )}
    </motion.div>
  );
}