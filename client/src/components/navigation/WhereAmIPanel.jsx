import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function WhereAmIPanel({
  isOpen,
  onClose,
  userLat,
  userLng,
  isRealGps,
  destinations,
  onSelectDestination,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Calculate distance in meters using Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Rank destinations by distance from user
  const rankedDestinations = useMemo(() => {
    return destinations
      .map((dest) => {
        const dist = calculateDistance(userLat, userLng, dest.lat, dest.lng);
        const walkMins = Math.max(1, Math.round(dist / (1.25 * 60)));
        return {
          ...dest,
          computedDistance: dist,
          computedWalkMins: walkMins,
        };
      })
      .sort((a, b) => a.computedDistance - b.computedDistance);
  }, [userLat, userLng, destinations]);

  const nearestSpot = rankedDestinations[0];

  const categories = ["All", "Hackathon Hub", "Dining", "Academic", "Hostel", "Recreation"];

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return rankedDestinations;
    return rankedDestinations.filter((d) => d.category === selectedCategory);
  }, [rankedDestinations, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
              📍
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Where Am I?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRealGps
                  ? "Live GPS Proximity Scanner Active"
                  : "Estimated from GPREC Main Gate"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Highlight nearest venue badge */}
        {nearestSpot && (
          <div className="mx-5 mt-4 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl">{nearestSpot.icon}</span>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Closest Venue To You
                </span>
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {nearestSpot.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {nearestSpot.computedDistance <= 30
                    ? "🎉 You are right here!"
                    : `~${nearestSpot.computedDistance} m away • ${nearestSpot.computedWalkMins} min walk`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectDestination(nearestSpot);
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm transition"
            >
              Go Here ➔
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ranked Venue List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.map((dest, idx) => (
            <div
              key={dest.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {dest.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                    <h5 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {dest.name}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {dest.tagline || dest.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block font-mono">
                    {dest.computedDistance >= 1000
                      ? `${(dest.computedDistance / 1000).toFixed(1)} km`
                      : `${dest.computedDistance} m`}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ~{dest.computedWalkMins} min
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectDestination(dest);
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-600 dark:text-slate-300 transition"
                  title="Navigate here"
                >
                  ➔
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-center text-xs text-slate-400">
          Tip: Tap any venue above to draw an instant walking route with compass direction!
        </div>
      </motion.div>
    </div>
  );
}
