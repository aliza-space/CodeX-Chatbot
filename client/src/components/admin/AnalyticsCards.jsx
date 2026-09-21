export default function AnalyticsCards({ analytics }) {
  if (!analytics) return null;
  const {
    topQuestions = [],
    unanswered = [],
    feedbackStats = [],
    dailyUsage = [],
    recentFeedback = [],
  } = analytics;

  const up = feedbackStats.find((f) => f._id === "up")?.count || 0;
  const down = feedbackStats.find((f) => f._id === "down")?.count || 0;
  const total = up + down;
  const ratio = total ? Math.round((up / total) * 100) : null;
  const todayCount = dailyUsage[0]?.count ?? 0;

  return (
    <div className="space-y-6 mb-6">
      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Feedback Card */}
        <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Satisfaction Rate
            </span>
            <span className="text-lg p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              👍
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {ratio !== null ? `${ratio}%` : "—"}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{up} Helpful</span>
              <span>•</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">{down} Reported</span>
            </div>
          </div>
        </div>

        {/* Unanswered Card */}
        <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Unanswered Queries
            </span>
            <span className="text-lg p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              ⚠️
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {unanswered.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {unanswered.length === 0 ? "All queries answered 🎉" : "Knowledge gaps needing attention"}
            </p>
          </div>
        </div>

        {/* Messages Card */}
        <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recent Traffic
            </span>
            <span className="text-lg p-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              💬
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {todayCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              User messages logged today
            </p>
          </div>
        </div>
      </div>

      {/* Top Questions */}
      <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
            Most Frequently Asked Questions
          </h3>
          <span className="text-xs text-slate-400">Trending user topics</span>
        </div>
        <ul className="space-y-2">
          {topQuestions.slice(0, 5).map((q, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="truncate">{q._id}</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                {q.count} queries
              </span>
            </li>
          ))}
          {topQuestions.length === 0 && (
            <li className="text-slate-400 text-xs py-2">No user query history logged yet.</li>
          )}
        </ul>
      </div>

      {/* Participant Reactions & Feedback Log Table */}
      <div className="rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
              Participant Reactions & Feedback
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live reactions received on chatbot answers
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/80">
            {total} Total Reactions
          </span>
        </div>

        {recentFeedback.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-6">
            No reactions submitted yet. When participants thumbs up or down an answer, it will appear here.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentFeedback.map((f) => (
              <div
                key={f._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl text-base ${
                      f.rating === "up"
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {f.rating === "up" ? "👍" : "👎"}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                      {f.message?.content || (
                        <span className="italic text-slate-400">Message content archived</span>
                      )}
                    </p>
                    {f.comment && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                        "{f.comment}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      f.rating === "up"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {f.rating === "up" ? "Helpful" : "Reported"}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(f.createdAt).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
