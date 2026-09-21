import { SLASH_COMMANDS } from "../../utils/constants.js";
import { IconCpu, IconSparkles, IconGuide, IconUsers, IconChat } from "../common/Icons.jsx";

function getCommandMeta(cmd) {
  if (cmd.startsWith("/event")) {
    return {
      category: "EVENT",
      color: "text-brand-300 bg-brand-500/15 border-brand-500/30",
      icon: IconCpu,
    };
  }
  if (cmd.startsWith("/register")) {
    return {
      category: "REGISTRATION",
      color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
      icon: IconSparkles,
    };
  }
  if (cmd.startsWith("/roadmap") || cmd.startsWith("/resources")) {
    return {
      category: "RESOURCES",
      color: "text-mint bg-brand-500/10 border-brand-500/30",
      icon: IconGuide,
    };
  }
  if (cmd.startsWith("/team")) {
    return {
      category: "TEAM",
      color: "text-amber-300 bg-amber-500/15 border-amber-500/30",
      icon: IconUsers,
    };
  }
  return {
    category: "GENERAL",
    color: "text-terminal-muted bg-terminal-panel border-terminal-border",
    icon: IconChat,
  };
}

export default function SlashCommandMenu({ query, onPick }) {
  const filtered = SLASH_COMMANDS.filter((c) => c.cmd.toLowerCase().startsWith(query.toLowerCase()));
  if (!filtered.length) return null;

  return (
    <div
      className="absolute bottom-full mb-3 w-full max-h-64 overflow-y-auto rounded-2xl border border-terminal-border bg-terminal-dark/95 backdrop-blur-xl shadow-2xl z-30 p-2 font-mono"
      role="listbox"
    >
      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-terminal-muted border-b border-terminal-border mb-1 flex items-center justify-between">
        <span>// SYSTEM_COMMANDS</span>
        <span>[TAB / CLICK TO SELECT]</span>
      </div>
      <div className="space-y-1">
        {filtered.map((c) => {
          const meta = getCommandMeta(c.cmd);
          const IconComp = meta.icon;
          return (
            <button
              key={c.cmd}
              onClick={() => onPick(c.cmd)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-terminal-panel border border-transparent hover:border-brand-500/30 flex items-center justify-between transition-colors group"
              role="option"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1 rounded-md bg-terminal-panel text-brand-400 shrink-0 border border-terminal-border">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-brand-400 shrink-0">
                  {c.cmd}
                </span>
                <span className="text-xs text-terminal-muted truncate max-w-[200px] sm:max-w-none">
                  {c.desc}
                </span>
              </div>
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${meta.color}`}
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
