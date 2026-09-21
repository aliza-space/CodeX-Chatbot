import React, { useState } from "react";
import api from "../../api/axios.js";
import { IconUsers, IconCpu, IconSparkles, IconTrash } from "../common/Icons.jsx";

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
    <div className="space-y-6 mb-6 font-mono">
      {actionError && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 flex items-center justify-between">
          <span>// ERR: {actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-400 font-bold px-1">✕</button>
        </div>
      )}

      {/* 4 Real-time KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Real Database Signups */}
        <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider">
              // TOTAL_SIGNUPS
            </span>
            <div className="p-1.5 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
              <IconUsers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {totalUsers}
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40">
                LIVE DB
              </span>
            </div>
            <p className="text-[11px] text-terminal-muted mt-1 truncate">
              Registered participant & admin accounts
            </p>
          </div>
        </div>

        {/* Metric 2: Today's Query Frequency */}
        <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider">
              // QUERY_FREQUENCY
            </span>
            <div className="p-1.5 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
              <IconCpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {todayQueries}
              </p>
              <span className="text-[11px] text-terminal-muted font-mono">today</span>
            </div>
            <p className="text-[11px] text-terminal-muted mt-1 truncate">
              {totalQueries} total queries across {totalConversations} sessions
            </p>
          </div>
        </div>

        {/* Metric 3: Satisfaction Rate */}
        <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider">
              // SATISFACTION_RATE
            </span>
            <div className="p-1.5 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
              <IconSparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {ratio !== null ? `${ratio}%` : "—"}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-terminal-muted mt-1">
              <span className="font-semibold text-brand-400">{up} Helpful</span>
              <span>•</span>
              <span className="font-semibold text-rose-400">{down} Reported</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Knowledge Gap Unanswered */}
        <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider">
              // UNANSWERED_GAPS
            </span>
            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <span className="text-xs">⚠️</span>
            </div>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {unanswered.length}
            </p>
            <p className="text-[11px] text-terminal-muted mt-1 truncate">
              {unanswered.length === 0 ? "All queries covered" : "Knowledge gaps to address"}
            </p>
          </div>
        </div>
      </div>

      {/* Query Frequency Trends */}
      <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>📈</span>
              <span>Query Frequency & Traffic Distribution</span>
            </h3>
            <p className="text-xs text-terminal-muted mt-0.5 font-mono">
              // Daily user queries occurring at the participant end
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30 self-start sm:self-auto">
            {dailyUsage.length} Days Active
          </span>
        </div>

        {dailyUsage.length === 0 ? (
          <p className="text-center text-xs text-terminal-muted py-6">// No query traffic logged yet.</p>
        ) : (
          <div className="space-y-2.5 font-mono">
            {dailyUsage.slice(0, 7).map((d) => {
              const maxCount = Math.max(...dailyUsage.map((item) => item.count), 1);
              const percentage = Math.round((d.count / maxCount) * 100);
              return (
                <div key={d._id} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-terminal-muted shrink-0">
                    {d._id}
                  </span>
                  <div className="flex-1 bg-terminal-panel rounded-full h-3.5 overflow-hidden flex items-center border border-terminal-border">
                    <div
                      className="bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                  <span className="w-16 font-bold text-right text-brand-300 shrink-0">
                    {d.count} {d.count === 1 ? "query" : "queries"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Queries Stream & Top Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 font-mono">
        {/* Live Query Stream */}
        <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                <span>Live Query Stream</span>
              </h3>
              <p className="text-xs text-terminal-muted">
                // Real questions asked in real time
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-terminal-panel text-brand-300 border border-terminal-border">
              {recentQueries.length} Recent
            </span>
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={querySearch}
              onChange={(e) => setQuerySearch(e.target.value)}
              placeholder="Search incoming queries..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-terminal-border bg-terminal-panel text-white placeholder-terminal-muted focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-72 space-y-2 pr-1 scrollbar-thin">
            {filteredQueries.map((q) => (
              <div
                key={q._id}
                className="p-2.5 rounded-xl bg-terminal-panel/80 border border-terminal-border flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-terminal-text line-clamp-2 leading-relaxed">
                    "{q.content}"
                  </p>
                </div>
                <span className="text-[10px] font-mono text-terminal-muted shrink-0 whitespace-nowrap">
                  {new Date(q.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            {filteredQueries.length === 0 && (
              <p className="text-center text-xs text-terminal-muted py-6">// No queries found.</p>
            )}
          </div>
        </div>

        {/* Top Trending Questions */}
        <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>🔥</span>
                <span>Top Trending Queries</span>
              </h3>
              <p className="text-xs text-terminal-muted">
                // Most frequent queries across participants
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-terminal-panel text-brand-300 border border-terminal-border">
              Top {topQuestions.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 space-y-2 pr-1 scrollbar-thin">
            {topQuestions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-terminal-panel/80 text-xs text-terminal-text border border-terminal-border gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-5 h-5 rounded bg-brand-500/20 text-brand-400 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-brand-500/30">
                    {i + 1}
                  </span>
                  <span className="truncate font-mono">{q._id}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30 shrink-0">
                  {q.count} {q.count === 1 ? "time" : "times"}
                </span>
              </div>
            ))}
            {topQuestions.length === 0 && (
              <p className="text-center text-xs text-terminal-muted py-6">// No query trends recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Registered Users Database Directory */}
      <div className="rounded-2xl p-4 sm:p-5 border border-terminal-border bg-terminal-dark shadow-xl font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <IconUsers className="w-4 h-4 text-brand-400" />
              <span>Registered Accounts Directory ({totalUsers})</span>
            </h3>
            <p className="text-xs text-terminal-muted mt-0.5">
              // Live MongoDB accounts. Real-time metrics update automatically on addition/deletion.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-terminal-border bg-terminal-panel text-white placeholder-terminal-muted focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl border border-terminal-border">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-terminal-panel text-terminal-muted font-semibold border-b border-terminal-border">
              <tr>
                <th className="py-2.5 px-3 sm:px-4">User</th>
                <th className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">Email</th>
                <th className="py-2.5 px-3 sm:px-4">Role</th>
                <th className="py-2.5 px-3 sm:px-4 hidden md:table-cell">Registered</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border/60">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-terminal-panel/40 transition">
                  <td className="py-2.5 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-brand-500/15 text-brand-400 border border-brand-500/30 font-bold flex items-center justify-center uppercase text-xs shrink-0">
                        {u.name ? u.name[0] : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                          {u.name || "Participant"}
                        </p>
                        <p className="text-[10px] text-terminal-muted sm:hidden truncate max-w-[120px]">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell text-terminal-muted">
                    {u.email}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 hidden md:table-cell text-terminal-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name || u.email)}
                      disabled={deletingUserId === u._id}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold text-rose-400 hover:bg-rose-500/20 border border-rose-500/40 transition disabled:opacity-40 cursor-pointer"
                      title="Delete account"
                    >
                      {deletingUserId === u._id ? "// Deleting..." : "[Delete]"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-terminal-muted text-xs">
                    // No registered accounts found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
