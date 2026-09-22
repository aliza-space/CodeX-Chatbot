import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import FeedbackButtons from "./FeedbackButtons.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import SuggestionChips from "./SuggestionChips.jsx";
import { useChatStore } from "../../store/chatStore.js";
import { findFacilityAndZone } from "../../data/campusGuideData.js";

export default function MessageBubble({ message, onRegenerate, onPickSuggestion }) {
  const isUser = message.role === "user";
  const openMap = useChatStore((s) => s.openMap);

  // Detect campus facilities or areas in assistant response
  const detectedLocation = (() => {
    if (isUser || message.streaming || !message.content) return null;
    return findFacilityAndZone(message.content);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex gap-3 sm:gap-4 w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant Avatar with Coders' Club Logo */}
      {!isUser && (
        <div className="shrink-0 pt-0.5 select-none">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center p-0.5">
            <img src="/logo.jpg" alt="Coders' Club" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      )}

      {/* Message Content Body */}
      <div className={`flex flex-col min-w-0 ${isUser ? "items-end max-w-[85%] sm:max-w-[75%]" : "items-start flex-1 max-w-full"}`}>
        {/* User Message Capsule */}
        {isUser ? (
          <div className="rounded-2xl rounded-tr-xs bg-blue-600 text-white px-4 py-2.5 text-sm sm:text-[14.5px] leading-relaxed shadow-sm break-words">
            <p className="whitespace-pre-wrap font-sans">{message.content}</p>
          </div>
        ) : (
          /* Assistant Message Body (Claude/ChatGPT Flow) */
          <div className="w-full text-slate-800 dark:text-slate-100 text-sm sm:text-[14.5px] leading-relaxed break-words">
            {message.streaming && !message.content ? (
              <TypingIndicator />
            ) : (
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table({ children, ...props }) {
                      return (
                        <div className="my-3 w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs bg-slate-50/50 dark:bg-slate-900/50 scrollbar-thin">
                          <table className="w-full text-left text-xs border-collapse min-w-[340px]" {...props}>
                            {children}
                          </table>
                        </div>
                      );
                    },
                    thead({ children, ...props }) {
                      return <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold" {...props}>{children}</thead>;
                    },
                    th({ children, ...props }) {
                      return <th className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-700 text-[11.5px] tracking-wide whitespace-nowrap" {...props}>{children}</th>;
                    },
                    td({ children, ...props }) {
                      return <td className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-[12px] align-top text-slate-700 dark:text-slate-300" {...props}>{children}</td>;
                    },
                    h3({ children, ...props }) {
                      return <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5" {...props}>{children}</h3>;
                    },
                    ul({ children, ...props }) {
                      return <ul className="list-disc list-inside space-y-1 my-2 text-slate-700 dark:text-slate-300 text-xs sm:text-sm" {...props}>{children}</ul>;
                    },
                    ol({ children, ...props }) {
                      return <ol className="list-decimal list-inside space-y-1 my-2 text-slate-700 dark:text-slate-300 text-xs sm:text-sm" {...props}>{children}</ol>;
                    },
                    li({ children, ...props }) {
                      return <li className="leading-relaxed" {...props}>{children}</li>;
                    },
                    p({ children, ...props }) {
                      return <p className="mb-2 last:mb-0 leading-relaxed" {...props}>{children}</p>;
                    },
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="relative my-3 rounded-2xl overflow-hidden border border-slate-700/60 bg-[#0f172a] shadow-md">
                          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                            <span>{match[1]}</span>
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              padding: "1rem",
                              fontSize: "12.5px",
                              lineHeight: "1.6",
                              background: "transparent",
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code
                          className="bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 rounded-md px-1.5 py-0.5 font-mono text-[12px] font-semibold border border-slate-200 dark:border-slate-700"
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

            {/* GPREC Campus Landmark Trigger Card */}
            {detectedLocation && (
              <div className="mt-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200">
                  <span className="text-base">📍</span>
                  <div>
                    <span className="font-semibold block">Campus Location Mentioned:</span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-300">
                      {detectedLocation.facility?.name || detectedLocation.zone?.shortName}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openMap(detectedLocation.facility?.id || detectedLocation.zone.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Open Campus Map</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {/* Action Bar (Copy, Feedback, Regenerate) + Response Time */}
            {!isUser && !message.streaming && message.content && (
              <div className="mt-2.5 flex items-center justify-between flex-wrap gap-y-1">
                <FeedbackButtons
                  messageId={message.dbId}
                  content={message.content}
                  onRegenerate={onRegenerate}
                />
                {/* Response Time Badge */}
                {message.responseTimeMs != null && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none">
                    <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                    {message.responseTimeMs < 1000
                      ? `${message.responseTimeMs}ms`
                      : `${(message.responseTimeMs / 1000).toFixed(1)}s`}
                  </span>
                )}
              </div>
            )}

            {/* Follow-up Suggestion Chips */}
            {!isUser && !message.streaming && message.suggestions && message.suggestions.length > 0 && (
              <div className="w-full mt-3">
                <SuggestionChips
                  suggestions={message.suggestions}
                  onPick={(q) => onPickSuggestion?.(q)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}