import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPanel({ open, onClose, conversations, loading, onSelect, activeId, onDelete }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="absolute left-0 top-0 bottom-0 w-72 sm:w-80 max-w-[85vw] z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base">💬</span>
                <span className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                  Chat History
                </span>
                {conversations.length > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {conversations.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close history"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {loading && (
                <div className="flex items-center justify-center py-8 text-xs text-slate-400">
                  <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2" />
                  Loading conversations...
                </div>
              )}

              {!loading && conversations.length === 0 && (
                <div className="text-center py-10 px-4">
                  <div className="text-3xl mb-2">📜</div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No past sessions yet
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Your conversations will appear here automatically.
                  </p>
                </div>
              )}

              {!loading &&
                conversations.map((c) => {
                  const isActive = activeId === c._id;
                  return (
                    <div
                      key={c._id}
                      className={`group w-full p-2.5 rounded-xl transition-all flex items-center justify-between border ${
                        isActive
                          ? "bg-primary-50/80 dark:bg-primary-950/50 border-primary-300 dark:border-primary-800 text-primary-700 dark:text-primary-300 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <button
                        onClick={() => onSelect(c._id)}
                        className="flex-1 text-left min-w-0 pr-2"
                      >
                        <p className="text-xs font-medium truncate">
                          {c.title || "Untitled conversation"}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.updatedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </button>

                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this session?")) {
                              onDelete(c._id);
                            }
                          }}
                          title="Delete session"
                          className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}