import { motion } from "framer-motion";
import { IconTrophy, IconGuide, IconCpu } from "../common/Icons.jsx";

const TILES = [
  {
    icon: IconTrophy,
    title: "Prizes & Perks",
    desc: "₹50,000 prize pool, certificates & internship opportunities with WeDevit",
    badge: "Rewards",
    badgeColor: "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/60",
    iconColor: "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/60",
    query: "What are the prizes and perks for CodeX 4.0?",
  },
  {
    icon: IconGuide,
    title: "Rules & Format",
    desc: "2-3 members per team, eligibility criteria & judging rubric",
    badge: "Guidelines",
    badgeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
    iconColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
    query: "What are the eligibility rules and team format for CodeX 4.0?",
  },
  {
    icon: IconCpu,
    title: "Event Schedule",
    desc: "24 Sept 2026, 9:00 AM - 5:00 PM @ CSM Labs",
    badge: "Timeline",
    badgeColor: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
    iconColor: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
    query: "What is the detailed schedule and venue for CodeX 4.0?",
  },
  {
    icon: () => <span className="text-sm">📍</span>,
    title: "Campus Guide & Areas",
    desc: "Academic Area (CSM/CSE Labs) & Common Facilities (Library, Canteen, Amphi)",
    badge: "2 Areas",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    iconColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    query: "What facilities and areas are there in GPREC campus?",
  },
];

export default function QuickActionCards({ onPick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 max-w-xl mx-auto mt-4 sm:mt-5 w-full text-left">
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
            className="group relative text-left p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`p-2 rounded-xl border ${tile.iconColor} group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tile.badgeColor}`}>
                  {tile.badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {tile.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {tile.desc}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span>Ask CodeX Buddy</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold">→</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
