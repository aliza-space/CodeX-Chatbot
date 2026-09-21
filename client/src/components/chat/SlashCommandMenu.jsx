import { SLASH_COMMANDS } from "../../utils/constants.js";

function getCommandMeta(cmd) {
  if (cmd.startsWith("/event")) {
    return {
      category: "Events",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      icon: "📅",
    };
  }
  if (cmd.startsWith("/register")) {
    return {
      category: "Registration",
      color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800",
      icon: "⚡",
    };
  }
  if (cmd.startsWith("/roadmap") || cmd.startsWith("/resources")) {
    return {
      category: "Resources",
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
      icon: "📚",
    };
  }
  if (cmd.startsWith("/team")) {
    return {
      category: "Team",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      icon: "👥",
    };
  }
  return {
    category: "General",
    color: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
    icon: "💬",
  };
}

export default function SlashCommandMenu({ query, onPick }) {
  const filtered = SLASH_COMMANDS.filter((c) => c.cmd.toLowerCase().startsWith(query.toLowerCase()));
  if (!filtered.length) return null;

  return (
    <div
      className="absolute bottom-full mb-3 w-full max-h-64 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl z-30 p-1.5"
      role="listbox"
    >
      <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
        Command Shortcuts
      </div>
      <div className="space-y-0.5">
        {filtered.map((c) => {
          const meta = getCommandMeta(c.cmd);
          return (
            <button
              key={c.cmd}
              onClick={() => onPick(c.cmd)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors group"
              role="option"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{meta.icon}</span>
                <span className="font-mono text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                  {c.cmd}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px] sm:max-w-none">
                  {c.desc}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.color}`}
              >
                {meta.category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
