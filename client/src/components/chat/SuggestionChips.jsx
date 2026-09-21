export default function SuggestionChips({ suggestions, onPick }) {
  if (!suggestions?.length) return null;

  return (
    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        Suggested queries
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="group inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/40 shadow-sm transition-all"
          >
            <span>{s}</span>
            <svg
              className="w-3 h-3 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
