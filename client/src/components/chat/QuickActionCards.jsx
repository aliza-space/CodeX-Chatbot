import { motion } from "framer-motion";
import { IconTrophy, IconGuide, IconCpu, IconMap } from "../common/Icons.jsx";

const TILES = [
  {
    icon: IconTrophy,
    title: "Prizes & Perks",
    desc: "₹50,000 prize pool, certificates & internships with WeDevit",
    badge: "Rewards",
    color: "cyan",
    badgeColor: "bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
    query: "What are the prizes and perks for CodeX 4.0?",
  },
  {
    icon: IconGuide,
    title: "Rules & Format",
    desc: "2-3 members per team, eligibility criteria & judging rubric",
    badge: "Protocol",
    color: "primary",
    badgeColor: "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    query: "What are the eligibility rules and team format for CodeX 4.0?",
  },
  {
    icon: IconCpu,
    title: "Event Schedule",
    desc: "24 Sept 2026, 9:00 AM - 5:00 PM @ CSM Labs",
    badge: "Timeline",
    color: "purple",
    badgeColor: "bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    query: "What is the detailed schedule and venue for CodeX 4.0?",
  },
  {
    icon: IconMap,
    title: "Campus & Food",
    desc: "Food Court, Cafeteria, Library, Amphi & CSM Labs",
    badge: "Radar",
    color: "emerald",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    query: "Where is the campus food court, cafeteria, library, and amphi at GPREC?",
  },
];

export default function QuickActionCards({ onPick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 max-w-xl mx-auto mt-4 sm:mt-6 w-full text-left">
      {TILES.map((tile, i) => {
        const IconComponent = tile.icon;
        return (
          <motion.button
            key={tile.title}
            onClick={() => onPick(tile.query)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative text-left p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-cyan-500/20 bg-white/90 dark:bg-[#0c1322]/90 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all shadow-sm flex flex-col justify-between backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 ring-1 ring-slate-200/80 dark:ring-cyan-500/30 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tile.badgeColor}`}>
                  {tile.badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                {tile.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {tile.desc}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Execute Query</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
