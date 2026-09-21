export default function SuggestionChips({ suggestions, onPick }) {
  if (!suggestions?.length) return null;

  return (
    <div className="mt-3 pt-2 border-t border-terminal-border/60">
      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-terminal-muted mb-2">
        // suggested_prompts
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="group inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border border-terminal-border hover:border-brand-500/40 bg-terminal-panel text-terminal-text hover:text-brand-300 shadow-xs transition-all"
          >
            <span>{s}</span>
            <span className="text-terminal-muted group-hover:text-brand-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
