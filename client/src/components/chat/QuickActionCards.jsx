import { motion } from "framer-motion";
import { IconTrophy, IconPin, IconCpu, IconSparkles } from "../common/Icons.jsx";

const STARTERS = [
  {
    icon: IconTrophy,
    title: "Prizes & Rewards",
    subtitle: "₹50,000 cash prize pool, trophies, certificates & internship opportunities",
    query: "What are the prizes and perks for CodeX 4.0?",
    badge: "Rewards",
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40",
  },
  {
    icon: IconCpu,
    title: "Rules & Eligibility",
    subtitle: "2–3 members per team, eligibility criteria, and scoring rounds",
    query: "What are the eligibility rules and team format for CodeX 4.0?",
    badge: "Guidelines",
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40",
  },
  {
    icon: () => <span className="text-base">📅</span>,
    title: "Event Timeline",
    subtitle: "24 Sept 2026, 9:00 AM – 5:00 PM IST @ CSM Computer Labs",
    query: "What is the detailed schedule, reporting time, and rounds for CodeX 4.0?",
    badge: "Schedule",
    color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/40",
  },
  {
    icon: IconPin,
    title: "Campus Guide & Map",
    subtitle: "Directions to CSM Labs, Central Library, Canteens & Auditorium",
    query: "Where is the CSM computer lab and what facilities are nearby at GPREC?",
    badge: "Navigation",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40",
  },
];

export default function QuickActionCards({ onPick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-2xl mx-auto mt-4 sm:mt-6 text-left">
      {STARTERS.map((s, idx) => {
        const IconComponent = s.icon;
        return (
          <motion.button
            key={s.title}
            onClick={() => onPick(s.query)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.2 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl border ${s.color} group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.color}`}>
                  {s.badge}
                </span>
              </div>

              <h4 className="font-display font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {s.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {s.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span>Ask CodeX Buddy</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold">→</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
