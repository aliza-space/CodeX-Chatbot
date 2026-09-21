import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios.js";

export default function FeedbackButtons({ messageId, content, onRegenerate }) {
  const [rating, setRating] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const sendFeedback = async (r) => {
    if (!messageId) return;
    const next = rating === r ? null : r;
    setRating(next);
    if (!next) return;

    try {
      await api.post("/api/feedback", { messageId, rating: next });
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPressed = rating !== null;

  return (
    <div
      className={`flex items-center justify-between mt-3 pt-2 text-xs transition-all duration-300 rounded-xl ${
        isPressed
          ? "bg-slate-900/10 dark:bg-slate-950/90 border border-slate-300/80 dark:border-slate-800 p-2 shadow-inner"
          : "border-t border-slate-100 dark:border-slate-800/80"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          title="Copy message"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        {/* Reaction Buttons */}
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => sendFeedback("up")}
            aria-pressed={rating === "up"}
            whileTap={{ scale: 0.85 }}
            title="Helpful answer"
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              rating === "up"
                ? "bg-slate-900 text-emerald-400 dark:bg-black dark:text-emerald-400 shadow-md ring-2 ring-emerald-500/60 font-semibold"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <svg className="w-4 h-4" fill={rating === "up" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {rating === "up" && <span className="text-[11px] text-emerald-400 font-medium">Helpful</span>}
          </motion.button>

          <motion.button
            onClick={() => sendFeedback("down")}
            aria-pressed={rating === "down"}
            whileTap={{ scale: 0.85 }}
            title="Needs improvement"
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              rating === "down"
                ? "bg-slate-900 text-rose-400 dark:bg-black dark:text-rose-400 shadow-md ring-2 ring-rose-500/60 font-semibold"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <svg className="w-4 h-4" fill={rating === "down" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            {rating === "down" && <span className="text-[11px] text-rose-400 font-medium">Reported</span>}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-rose-500 font-medium ml-1"
            >
              Failed to save
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onRegenerate}
        title="Regenerate response"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Regenerate</span>
      </button>
    </div>
  );
}