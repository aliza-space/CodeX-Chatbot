import React, { useState } from "react";
import api from "../../api/axios.js";

export default function AnalyticsCards({ analytics, onRefresh }) {
  const [userSearch, setUserSearch] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [actionError, setActionError] = useState(null);

  if (!analytics) return null;

  const {
    totalUsers = 0,
    users = [],
    totalQueries = 0,
    todayQueries = 0,
    totalConversations = 0,
    topQuestions = [],
    unanswered = [],
    feedbackStats = [],
    dailyUsage = [],
    recentFeedback = [],
    recentQueries = [],
  } = analytics;

  const up = feedbackStats.find((f) => f._id === "up")?.count || 0;
  const down = feedbackStats.find((f) => f._id === "down")?.count || 0;
  const total = up + down;
  const ratio = total ? Math.round((up / total) * 100) : null;

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will permanently remove their account from the database.`)) {
      return;
    }
    setDeletingUserId(userId);
    setActionError(null);
    try {
      await api.delete(`/api/admin/analytics/users/${userId}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  const filteredQueries = recentQueries.filter((m) => {
    return m.content?.toLowerCase().includes(querySearch.toLowerCase());
  });

  return (
    <div className="space-y-6 mb-6">
      {actionError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
          <span>⚠️ {actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-500 font-bold px-1">✕</button>
        </div>
      )}

      {/* 4 Real-time KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Real Database Signups */}
        <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Signups
            </span>
            <span className="text-base p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              👥
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalUsers}
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Live DB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              Registered participant & admin accounts
            </p>
          </div>
        </div>

        {/* Metric 2: Today's Query Frequency */}
        <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Query Frequency
            </span>
            <span className="text-base p-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              ⚡
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {todayQueries}
              </p>
              <span className="text-[11px] font-semibold text-slate-400">today</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {totalQueries} all-time queries across {totalConversations} chats
            </p>
          </div>
        </div>

        {/* Metric 3: Satisfaction Rate */}
        <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Satisfaction Rate
            </span>
            <span className="text-base p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              👍
            </span>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {ratio !== null ? `${ratio}%` : "—"}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{up} Helpful</span>
              <span>•</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">{down} Reported</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Knowledge Gap Unanswered */}
        <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Unanswered Questions
            </span>
            <span className="text-base p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              ⚠️
            </span>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {unanswered.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {unanswered.length === 0 ? "All queries covered 🎉" : "Knowledge gaps to address"}
            </p>
          </div>
        </div>
      </div>

      {/* Query Frequency Trends & Daily Timeline */}
      <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>📈</span>
              <span>Query Frequency & Traffic Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of daily user queries happening at the participant end
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/80 self-start sm:self-auto">
            {dailyUsage.length} Active Days Tracked
          </span>
        </div>

        {dailyUsage.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-6">No historical query traffic recorded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {dailyUsage.slice(0, 7).map((d) => {
              const maxCount = Math.max(...dailyUsage.map((item) => item.count), 1);
              const percentage = Math.round((d.count / maxCount) * 100);
              return (
                <div key={d._id} className="flex items-center gap-3 text-xs">
                  <span className="w-24 font-mono font-medium text-slate-500 dark:text-slate-400 shrink-0">
                    {d._id}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden flex items-center">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-indigo-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                  <span className="w-16 font-bold text-right text-slate-800 dark:text-slate-200 font-mono shrink-0">
                    {d.count} {d.count === 1 ? "query" : "queries"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Queries Stream & Most Frequent Questions (Side by Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Real-Time Live User Query Stream */}
        <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Query Stream</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real questions asked by participants in real time
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {recentQueries.length} Recent
            </span>
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={querySearch}
              onChange={(e) => setQuerySearch(e.target.value)}
              placeholder="Search incoming queries..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-72 space-y-2 pr-1 scrollbar-thin">
            {filteredQueries.map((q) => (
              <div
                key={q._id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                    "{q.content}"
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 whitespace-nowrap">
                  {new Date(q.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            {filteredQueries.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">No queries found matching filter.</p>
            )}
          </div>
        </div>

        {/* Most Frequently Asked Questions */}
        <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔥</span>
                <span>Top Trending Queries</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Highest frequency questions across all participants
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Top {topQuestions.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 space-y-2 pr-1 scrollbar-thin">
            {topQuestions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate">{q._id}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 shrink-0">
                  {q.count} {q.count === 1 ? "time" : "times"}
                </span>
              </div>
            ))}
            {topQuestions.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">No user query history logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Registered Users Database Directory (With Live Add/Delete reflection) */}
      <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>👥</span>
              <span>Registered Accounts Directory ({totalUsers})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live user accounts in MongoDB. Real-time metric updates automatically on signup or deletion.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search user name, email, role..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 sm:px-4">User</th>
                <th className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">Email</th>
                <th className="py-2.5 px-3 sm:px-4">Role</th>
                <th className="py-2.5 px-3 sm:px-4 hidden md:table-cell">Signed Up</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center uppercase text-xs shrink-0">
                        {u.name ? u.name[0] : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                          {u.name || "Participant"}
                        </p>
                        <p className="text-[10px] text-slate-400 sm:hidden truncate max-w-[120px]">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell text-slate-600 dark:text-slate-300 font-mono">
                    {u.email}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                          : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 hidden md:table-cell text-slate-400 font-mono">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name || u.email)}
                      disabled={deletingUserId === u._id}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 transition disabled:opacity-40 cursor-pointer"
                      title="Delete user account"
                    >
                      {deletingUserId === u._id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400 text-xs">
                    No registered accounts matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Reactions & Feedback Log Table */}
      <div className="rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Participant Reactions & Feedback
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live feedback received on chatbot answers
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
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
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
