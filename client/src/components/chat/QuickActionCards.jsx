import { motion } from "framer-motion";
import { IconTrophy, IconGuide, IconCpu, IconMap } from "../common/Icons.jsx";

const TILES = [
  {
    icon: IconTrophy,
    title: "Prizes & Perks",
    desc: "₹50,000 prize pool, certificates & internships with WeDevit",
    badge: "Rewards",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
    query: "What are the prizes and perks for CodeX 4.0?",
  },
  {
    icon: IconGuide,
    title: "Rules & Format",
    desc: "2-3 members per team, eligibility criteria & judging rubric",
    badge: "Guidelines",
    badgeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    iconColor: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60",
    query: "What are the eligibility rules and team format for CodeX 4.0?",
  },
  {
    icon: IconCpu,
    title: "Event Schedule",
    desc: "24 Sept 2026, 9:00 AM - 5:00 PM @ CSM Labs",
    badge: "Timeline",
    badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
    query: "What is the detailed schedule and venue for CodeX 4.0?",
  },
  {
    icon: IconMap,
    title: "Campus & Food",
    desc: "Food Court, Cafeteria, Library, Amphi & CSM Labs",
    badge: "Navigator",
    badgeColor: "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800",
    iconColor: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60",
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
            className="group relative text-left p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${tile.iconColor} group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tile.badgeColor}`}>
                  {tile.badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                {tile.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {tile.desc}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-primary-600 dark:text-primary-400">
              <span>Explore</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
