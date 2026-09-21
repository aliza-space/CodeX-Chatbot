import { useState } from "react";
import api from "../../api/axios.js";

export default function AnnouncementForm({ announcements, onChanged }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await api.post("/api/announcements", { text, priority: Number(priority), active: true });
      setText("");
      setPriority(0);
      onChanged?.();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (a) => {
    await api.patch(`/api/announcements/${a._id}`, { active: !a.active });
    onChanged?.();
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to remove this announcement?")) return;
    await api.delete(`/api/announcements/${id}`);
    onChanged?.();
  };

  return (
    <div className="space-y-5">
      {/* Creation Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. CodeX 4.0 registrations close on 23 Sept — register now!"
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary-500"
            title="Priority level (higher numbers take precedence)"
            placeholder="Priority"
          />
          <button
            onClick={handleCreate}
            disabled={!text.trim() || submitting}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-40 transition-all shadow-sm"
          >
            {submitting ? "Adding..." : "Add Ticker"}
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-2.5">
        {announcements?.map((a) => (
          <div
            key={a._id}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 pr-3">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  a.active
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {a.active ? "Active" : "Inactive"}
              </span>
              <span className={`text-sm ${a.active ? "text-slate-800 dark:text-slate-200 font-medium" : "line-through text-slate-400"}`}>
                {a.text}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(a)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors"
              >
                {a.active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => remove(a._id)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {(!announcements || announcements.length === 0) && (
          <p className="text-center text-xs text-slate-400 py-6">
            No announcements created yet.
          </p>
        )}
      </div>
    </div>
  );
}
