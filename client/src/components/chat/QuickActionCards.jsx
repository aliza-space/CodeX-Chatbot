import { motion } from "framer-motion";

const TILES = [
  {
    icon: "🏆",
    title: "Prizes & Perks",
    desc: "₹1,50,000 prize pool, certificates & internships",
    badge: "Rewards",
    badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    query: "What are the prizes and perks for CodeX 4.0?",
  },
  {
    icon: "📋",
    title: "Rules & Format",
    desc: "2-3 members, eligibility & judging criteria",
    badge: "Guidelines",
    badgeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    query: "What are the eligibility rules and team format for CodeX 4.0?",
  },
  {
    icon: "📅",
    title: "Event Schedule",
    desc: "24 Sept 2026, 9:00 AM - 5:00 PM @ CSM Labs",
    badge: "Timeline",
    badgeColor: "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    query: "What is the detailed schedule and venue for CodeX 4.0?",
  },
  {
    icon: "🗺️",
    title: "Campus & Food",
    desc: "Food Court, Cafeteria, Library, Amphi & Labs",
    badge: "Navigator",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    query: "Where is the campus food court, cafeteria, library, and amphi at GPREC?",
  },
];

export default function QuickActionCards({ onPick }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto mt-3 sm:mt-5 w-full text-left">
      {TILES.map((tile, i) => (
        <motion.button
          key={tile.title}
          onClick={() => onPick(tile.query)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="group relative text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-lg sm:text-2xl p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                {tile.icon}
              </span>
              <span className={`hidden xs:inline-flex text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border ${tile.badgeColor}`}>
                {tile.badge}
              </span>
            </div>
            <h3 className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
              {tile.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 leading-snug sm:leading-relaxed line-clamp-2">
              {tile.desc}
            </p>
          </div>

          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-primary-600 dark:text-primary-400 opacity-80 group-hover:opacity-100">
            <span>Explore</span>
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
