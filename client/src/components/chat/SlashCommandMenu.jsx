import { SLASH_COMMANDS } from "../../utils/constants.js";
import { IconCpu, IconSparkles, IconGuide, IconUsers, IconChat } from "../common/Icons.jsx";

function getCommandMeta(cmd) {
  if (cmd.startsWith("/event")) {
    return {
      category: "EVENT",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      icon: IconCpu,
    };
  }
  if (cmd.startsWith("/register")) {
    return {
      category: "REGISTRATION",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      icon: IconSparkles,
    };
  }
  if (cmd.startsWith("/roadmap") || cmd.startsWith("/resources")) {
    return {
      category: "RESOURCES",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800",
      icon: IconGuide,
    };
  }
  if (cmd.startsWith("/team")) {
    return {
      category: "TEAM",
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
      icon: IconUsers,
    };
  }
  return {
    category: "GENERAL",
    color: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
    icon: IconChat,
  };
}

export default function SlashCommandMenu({ query, onPick }) {
  const filtered = SLASH_COMMANDS.filter((c) => c.cmd.toLowerCase().startsWith(query.toLowerCase()));
  if (!filtered.length) return null;

  return (
    <div
      className="absolute bottom-full mb-3 w-full max-h-64 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-30 p-2 text-slate-800 dark:text-slate-200 scrollbar-thin"
      role="listbox"
    >
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
        <span>Available Commands</span>
        <span>Click or Tab to select</span>
      </div>
      <div className="space-y-1">
        {filtered.map((c) => {
          const meta = getCommandMeta(c.cmd);
          const IconComp = meta.icon;
          return (
            <button
              key={c.cmd}
              onClick={() => onPick(c.cmd)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between transition-colors group"
              role="option"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0 border border-slate-200 dark:border-slate-700">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                  {c.cmd}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-none">
                  {c.desc}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${meta.color}`}
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
