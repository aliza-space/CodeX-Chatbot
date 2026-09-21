export default function SuggestionChips({ suggestions, onPick }) {
  if (!suggestions?.length) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
        Suggested Inquiries
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="group inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs transition-all"
          >
            <span>{s}</span>
            <span className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform font-bold">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
