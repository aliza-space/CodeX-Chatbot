import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import FeedbackButtons from "./FeedbackButtons.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import SuggestionChips from "./SuggestionChips.jsx";
import { useChatStore } from "../../store/chatStore.js";
import { IconMap, IconUser } from "../common/Icons.jsx";

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
      {/* Assistant Avatar with Coders' Club Logo */}
      {!isUser && (
        <div className="shrink-0 pt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden ring-1 ring-brand-500/50 bg-terminal-panel shadow-terminal-glow flex items-center justify-center p-0.5">
            <img src="/logo.jpg" alt="Coders' Club" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      )}

      <div className={`max-w-[92%] sm:max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Name & Time Header */}
        <div className="flex items-center gap-1.5 px-1 mb-1 text-[10px] font-mono text-terminal-muted">
          <span className="font-semibold text-brand-400">
            {isUser ? "// user_query" : "// codebuddy_ai"}
          </span>
          <span>•</span>
          <span>{time}</span>
        </div>

        {/* Message Bubble Container */}
        <div
          className={`rounded-2xl px-4 py-3 text-[13.5px] sm:text-[14px] leading-relaxed shadow-sm transition-all break-words ${
            isUser
              ? "bg-gradient-to-r from-brand-600 via-brand-700 to-emerald-800 text-white rounded-tr-xs shadow-terminal-glow"
              : "bg-terminal-panel border border-terminal-border text-terminal-text rounded-tl-xs backdrop-blur-md"
          }`}
        >
          {message.streaming && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap font-sans">{message.content}</p>
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
                          background: "#060907",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-terminal-dark text-brand-300 rounded px-1.5 py-0.5 font-mono text-[12px] font-semibold border border-brand-500/25"
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

          {/* Interactive Campus Radar Trigger when locations are discussed */}
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
              <div className="mt-3 pt-2.5 border-t border-terminal-border flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openMap(destId)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-terminal-dark bg-brand-400 hover:bg-brand-300 shadow-terminal-glow active:scale-95 transition-all cursor-pointer"
                >
                  <IconMap className="w-3.5 h-3.5" />
                  <span>[Launch Radar: {label}]</span>
                  <span>→</span>
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

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 pt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-terminal-panel border border-brand-500/40 text-brand-300 flex items-center justify-center text-xs font-bold shadow-xs">
            <IconUser className="w-4 h-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
}