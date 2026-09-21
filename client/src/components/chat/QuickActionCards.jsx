import { motion } from "framer-motion";
import { IconTrophy, IconGuide, IconCpu, IconMap } from "../common/Icons.jsx";

const TILES = [
  {
    icon: IconTrophy,
    title: "Prizes & Perks",
    desc: "₹50,000 prize pool, certificates & internships with WeDevit",
    badge: "REWARDS",
    query: "What are the prizes and perks for CodeX 4.0?",
  },
  {
    icon: IconGuide,
    title: "Rules & Format",
    desc: "2-3 members per team, eligibility criteria & judging rubric",
    badge: "PROTOCOL",
    query: "What are the eligibility rules and team format for CodeX 4.0?",
  },
  {
    icon: IconCpu,
    title: "Event Schedule",
    desc: "24 Sept 2026, 9:00 AM - 5:00 PM @ CSM Labs",
    badge: "TIMELINE",
    query: "What is the detailed schedule and venue for CodeX 4.0?",
  },
  {
    icon: IconMap,
    title: "Campus & Food",
    desc: "Food Court, Cafeteria, Library, Amphi & CSM Labs",
    badge: "WAYFINDING",
    query: "Where is the campus food court, cafeteria, library, and amphi at GPREC?",
  },
];

export default function QuickActionCards({ onPick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 max-w-xl mx-auto mt-4 sm:mt-5 w-full text-left">
      {TILES.map((tile, i) => {
        const IconComponent = tile.icon;
        return (
          <motion.button
            key={tile.title}
            onClick={() => onPick(tile.query)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative text-left p-3.5 sm:p-4 rounded-2xl border border-terminal-border hover:border-brand-500/50 bg-terminal-panel/90 hover:bg-terminal-card hover:shadow-terminal-glow transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/25 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-terminal-dark transition-all">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
                  {tile.badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-brand-300 transition-colors truncate">
                {tile.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-terminal-muted mt-1 leading-relaxed line-clamp-2">
                {tile.desc}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-terminal-border/60 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-semibold text-brand-400">
              <span>// execute_query</span>
              <span className="group-hover:translate-x-1 transition-transform font-mono">→</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
