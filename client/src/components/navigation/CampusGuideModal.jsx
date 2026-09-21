import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAMPUS_ZONES, findFacilityAndZone, GPREC_INFO } from "../../data/campusGuideData.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import {
  IconCross,
  IconSearch,
  IconSparkles,
  IconPin,
  IconExternal
} from "../common/Icons.jsx";

export default function CampusGuideModal({ isOpen, onClose, initialDestinationId }) {
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { sendMessage } = useChatStream();

  // Sync initial target destination from chatbot trigger
  useEffect(() => {
    if (isOpen && initialDestinationId) {
      const match = findFacilityAndZone(initialDestinationId);
      if (match) {
        setSelectedZoneId(match.zone.id);
        setSelectedFacilityId(match.facility?.id || null);
      } else {
        setSelectedZoneId(null);
        setSelectedFacilityId(null);
      }
    } else if (isOpen && !initialDestinationId) {
      // Default view showing both campus areas
      setSelectedZoneId(null);
      setSelectedFacilityId(null);
    }
  }, [isOpen, initialDestinationId]);

  const activeZone = useMemo(() => {
    return CAMPUS_ZONES.find((z) => z.id === selectedZoneId) || null;
  }, [selectedZoneId]);

  const activeFacility = useMemo(() => {
    if (!activeZone) return null;
    return activeZone.facilities.find((f) => f.id === selectedFacilityId) || null;
  }, [activeZone, selectedFacilityId]);

  // Filter facilities based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results = [];

    for (const zone of CAMPUS_ZONES) {
      for (const facility of zone.facilities) {
        const matches =
          facility.name.toLowerCase().includes(q) ||
          facility.shortName.toLowerCase().includes(q) ||
          facility.summary.toLowerCase().includes(q) ||
          facility.area.toLowerCase().includes(q) ||
          facility.highlights.some((h) => h.toLowerCase().includes(q));

        if (matches) {
          results.push({ zone, facility });
        }
      }
    }
    return results;
  }, [searchQuery]);

  const handleSelectFacility = (zoneId, facilityId) => {
    setSelectedZoneId(zoneId);
    setSelectedFacilityId(facilityId);
    setSearchQuery("");
  };

  const handleAskAboutFacility = (facility) => {
    onClose();
    if (facility?.queryPrompt) {
      sendMessage(facility.queryPrompt);
    } else if (facility?.name) {
      sendMessage(`Tell me about ${facility.name} at GPREC campus`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-40"
      />

      {/* Main Campus Guide Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl z-50 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* ========================================================= */}
        {/* 1. TOP HEADER & SEARCH                                    */}
        {/* ========================================================= */}
        <header className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-md shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs text-sm shrink-0">
                📍
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2 truncate">
                  <span>GPREC Campus Guide</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    2 Campus Areas
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {GPREC_INFO.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Close campus guide"
            >
              <IconCross className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Facility Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities (e.g. Library, CSM Labs, Food Court, Canteen)..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <IconSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-2.5"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. BODY CONTENT (SCROLLABLE)                              */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
          {/* SEARCH RESULTS VIEW */}
          {searchQuery.trim() ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Search results for "{searchQuery}"</span>
                <span>{searchResults.length} found</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-2xl">🔍</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
                    No matching facilities found
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Try searching for "library", "labs", "food", "auditorium", or "sports".
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map(({ zone, facility }) => (
                    <button
                      key={facility.id}
                      onClick={() => handleSelectFacility(zone.id, facility.id)}
                      className="w-full p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500 text-left transition flex items-start justify-between gap-3 group cursor-pointer shadow-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-lg p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0">
                          {facility.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {facility.name}
                            </h4>
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {zone.shortName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {facility.summary}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition font-bold text-xs shrink-0 mt-1">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* DEFAULT VISUAL MINI CAMPUS GUIDE */
            <div className="space-y-4">
              {/* Illustrated Mini Campus Stage */}
              <div className="relative rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-slate-100/90 via-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:via-slate-900/60 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
                {/* Background Campus Grid / Landscape Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                {/* Sub-header Banner */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      GPREC Campus Layout
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Select an area to explore
                  </span>
                </div>

                {/* THE TWO PRIMARY CAMPUS ANCHOR CARDS */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {CAMPUS_ZONES.map((zone) => {
                    const isSelected = selectedZoneId === zone.id;
                    const isAcademic = zone.id === "academic-zone";

                    return (
                      <motion.button
                        key={zone.id}
                        type="button"
                        onClick={() => {
                          setSelectedZoneId(isSelected ? null : zone.id);
                          setSelectedFacilityId(null);
                        }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? isAcademic
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40"
                              : "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/40"
                            : "bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs"
                        }`}
                      >
                        {/* Zone Indicator Header */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isSelected
                                  ? "bg-white/20 text-white border-white/30"
                                  : isAcademic
                                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                  : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              }`}
                            >
                              {zone.badge}
                            </span>
                            <span className="text-xl">{zone.icon}</span>
                          </div>

                          <h3
                            className={`font-display font-bold text-sm tracking-tight ${
                              isSelected ? "text-white" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {zone.name}
                          </h3>
                          <p
                            className={`text-[11px] mt-1 leading-relaxed ${
                              isSelected ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {zone.subtitle}
                          </p>
                        </div>

                        {/* Bottom Summary Pill */}
                        <div
                          className={`mt-3 pt-2.5 border-t text-[11px] font-semibold flex items-center justify-between ${
                            isSelected
                              ? "border-white/20 text-white"
                              : "border-slate-100 dark:border-slate-700/60 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          <span>{zone.facilities.length} Verified Facilities</span>
                          <span>{isSelected ? "Active ✓" : "Explore →"}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Illustrated Pedestrian Connector Walkway */}
                <div className="relative z-10 mt-3 pt-2 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  <span>🏛️ Academic Quadrangle</span>
                  <span className="font-mono text-blue-500">┈┈┈ 🌿 Central Campus Walkway ┈┈┈</span>
                  <span>🌟 Common Amenities</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 3. EXPANDED FACILITIES LIST FOR ACTIVE ZONE               */}
              {/* ========================================================= */}
              {activeZone ? (
                <div className="space-y-3 animate-fade-in pt-1">
                  {/* Zone Overview Banner */}
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{activeZone.icon}</span>
                        <span>{activeZone.name} Facilities</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {activeZone.tagline}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedZoneId(null);
                        setSelectedFacilityId(null);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Show All Zones
                    </button>
                  </div>

                  {/* Facilities Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeZone.facilities.map((fac) => {
                      const isExpanded = selectedFacilityId === fac.id;

                      return (
                        <div
                          key={fac.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isExpanded
                              ? "col-span-1 sm:col-span-2 bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 shadow-sm"
                              : "bg-white dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs"
                          }`}
                        >
                          {/* Card Header Tap Target */}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFacilityId(isExpanded ? null : fac.id)
                            }
                            className="w-full p-3 text-left flex items-start justify-between gap-2.5 cursor-pointer"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className="text-base p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0">
                                {fac.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {fac.name}
                                  </h4>
                                  {fac.badge && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                      {fac.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                                  {fac.area}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-slate-400 text-xs transition-transform mt-1 shrink-0 ${
                                isExpanded ? "rotate-180 text-blue-600" : ""
                              }`}
                            >
                              ▼
                            </span>
                          </button>

                          {/* Expanded Details Tray */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.15 }}
                                className="px-3 pb-3 pt-0 border-t border-blue-100 dark:border-blue-900/40 text-xs space-y-2.5"
                              >
                                <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed text-[11px]">
                                  {fac.summary}
                                </p>

                                <div className="space-y-1 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-blue-100/60 dark:border-slate-800">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                    Verified Highlights
                                  </span>
                                  {fac.highlights.map((h, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300"
                                    >
                                      <span className="text-blue-500 font-bold shrink-0">•</span>
                                      <span className="leading-relaxed">{h}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] text-slate-400">
                                    Official GPREC verified data
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAskAboutFacility(fac)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xs active:scale-95 transition cursor-pointer"
                                  >
                                    <IconSparkles className="w-3.5 h-3.5" />
                                    <span>Ask CodeBuddy</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* QUICK OVERVIEW WHEN NO ZONE IS SELECTED */
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    💡 Click either <strong className="text-blue-600 dark:text-blue-400">Academic Area</strong> or <strong className="text-emerald-600 dark:text-emerald-400">Student & Common Facilities</strong> above.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Discover department blocks, computer labs, dining hubs, library resources, and event venues.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. MODAL FOOTER                                           */}
        {/* ========================================================= */}
        <footer className="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">GPREC Campus Guide • Official Portal</span>
          </div>

          <a
            href={GPREC_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold shrink-0 ml-2"
          >
            <span>gprec.ac.in</span>
            <IconExternal className="w-3 h-3" />
          </a>
        </footer>
      </motion.div>
    </div>
  );
}
