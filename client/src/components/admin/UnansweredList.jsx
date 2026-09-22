export default function UnansweredList({ unanswered }) {
  if (!unanswered?.length) {
    return (
      <div className="text-center py-8">
        <span className="text-2xl">🎉</span>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
          Zero unanswered questions logged!
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          The knowledge base currently satisfies all user queries with confidence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {unanswered.map((u) => (
        <div
          key={u._id}
          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              {u.source === "negative_feedback" ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                  👎 Thumbs Down
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                  Low Confidence
                </span>
              )}
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              "{u.question}"
            </p>
            {u.feedbackComment && (
              <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 font-medium">
                User Note: "{u.feedbackComment}"
              </p>
            )}
            {u.rewrittenQuery && u.rewrittenQuery !== u.question && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rewritten: <span className="italic">{u.rewrittenQuery}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Logged on {new Date(u.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          {u.topScoreSeen != null && (
            <span className="self-start sm:self-auto text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shrink-0">
              Confidence: {u.topScoreSeen.toFixed(2)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
