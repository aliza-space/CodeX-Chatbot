import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CAMPUS_ZONES,
  findFacilityAndZone,
  searchCampusGuide,
  GPREC_INFO
} from "../../data/campusGuideData.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import CampusInteractiveMap from "./CampusInteractiveMap.jsx";
import {
  IconCross,
  IconSearch,
  IconSparkles,
  IconExternal,
  IconCpu
} from "../common/Icons.jsx";

const QUICK_FILTERS = [
  { id: "all", label: "All Areas", icon: "🌐" },
  { id: "hackathon", label: "Hackathons & AI", icon: "💻" },
  { id: "startups", label: "Startups & CIE", icon: "🚀" },
  { id: "venues", label: "Event Venues", icon: "🎭" },
  { id: "food", label: "Food & Canteen", icon: "🍴" },
  { id: "library", label: "Library & Research", icon: "📚" }
];

export default function CampusGuideModal({ isOpen, onClose, initialDestinationId }) {
  const [selectedZoneId, setSelectedZoneId] = useState("academic-zone");
  const [selectedFacilityId, setSelectedFacilityId] = useState("csm-labs");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showOverview, setShowOverview] = useState(false);
  const [mobileTab, setMobileTab] = useState("map"); // 'map' | 'guide'
  const { sendMessage } = useChatStream();

  // Sync initial target destination from chatbot trigger
  useEffect(() => {
    if (isOpen && initialDestinationId) {
      const match = findFacilityAndZone(initialDestinationId);
      if (match) {
        setSelectedZoneId(match.zone.id);
        setSelectedFacilityId(match.facility?.id || null);
        setActiveFilter("all");
      }
    } else if (isOpen && !initialDestinationId) {
      setSelectedZoneId("academic-zone");
      setSelectedFacilityId("csm-labs");
      setActiveFilter("all");
    }
  }, [isOpen, initialDestinationId]);

  const activeZone = useMemo(() => {
    return CAMPUS_ZONES.find((z) => z.id === selectedZoneId) || CAMPUS_ZONES[0];
  }, [selectedZoneId]);

  // Deep search results across keywords, categories, and descriptions
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && activeFilter === "all") return null;
    return searchCampusGuide(searchQuery, activeFilter);
  }, [searchQuery, activeFilter]);

  const handleSelectFacility = (zoneId, facilityId) => {
    setSelectedZoneId(zoneId);
    setSelectedFacilityId(facilityId);
  };

  const handleAskAboutFacility = (facility) => {
    onClose();
    if (facility?.queryPrompt) {
      sendMessage(facility.queryPrompt);
    } else if (facility?.name) {
      sendMessage(`Tell me about ${facility.name} at GPREC campus`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
      />

      {/* Main Campus Guide & Navigation Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-6xl h-[92vh] max-h-[920px] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden text-slate-100"
      >
        {/* ========================================================= */}
        {/* 1. TOP HEADER & NAVIGATION CONTROLS                       */}
        {/* ========================================================= */}
        <header className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 text-lg shrink-0">
              🧭
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 truncate">
                <span>GPREC Interactive Campus Guide</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  Hackathon Edition
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                {GPREC_INFO.established}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile View Toggle */}
            <div className="flex lg:hidden bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setMobileTab("map")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  mobileTab === "map"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => setMobileTab("guide")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  mobileTab === "guide"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                📋 Guide
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
              aria-label="Close campus guide"
            >
              <IconCross className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. SPLIT LAYOUT: MAP (LEFT ~48%) + GUIDE (RIGHT ~52%)     */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* LEFT COLUMN: COMPACT INTERACTIVE CAMPUS MAP */}
          <div
            className={`w-full lg:w-[48%] h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 p-3 sm:p-4 bg-slate-950/60 ${
              mobileTab === "map" ? "flex" : "hidden lg:flex"
            }`}
          >
            <CampusInteractiveMap
              selectedFacilityId={selectedFacilityId}
              activeFilter={activeFilter}
              onSelectFacility={handleSelectFacility}
              onAskBuddy={handleAskAboutFacility}
            />
          </div>

          {/* RIGHT COLUMN: VISITOR DIRECTORY & ZONES */}
          <div
            className={`flex-1 flex-col overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-slate-900 ${
              mobileTab === "guide" ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Top Search Bar with Deep Keyword Querying */}
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search venues, Wi-Fi, power, Intel AI, CIE, canteen, ATM..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <IconSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-slate-400 hover:text-white absolute right-3 top-2.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills (Syncs with Map Dimming) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                {QUICK_FILTERS.map((f) => {
                  const isActive = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-500 font-semibold shadow-xs"
                          : "bg-slate-800/90 text-slate-300 border-slate-700 hover:border-blue-400 hover:text-white"
                      }`}
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* 3. SEARCH / FILTER RESULTS VIEW                           */}
            {/* ========================================================= */}
            {searchResults !== null ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>
                    {searchQuery.trim()
                      ? `Search: "${searchQuery}"`
                      : `Category: ${QUICK_FILTERS.find((f) => f.id === activeFilter)?.label}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-400">{searchResults.length} places found</span>
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Empty State Handling */}
                {searchResults.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-800/40 rounded-3xl border border-slate-800 space-y-3">
                    <span className="text-3xl">🔍</span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        No matching campus locations found
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        We couldn't find any venues matching "{searchQuery}". Try searching for keywords like <span className="text-blue-400">"Wi-Fi"</span>, <span className="text-blue-400">"Intel"</span>, <span className="text-blue-400">"Food"</span>, or <span className="text-blue-400">"CIE"</span>.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={handleResetFilters}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs cursor-pointer transition"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {searchResults.map(({ zone, facility }) => {
                      const isSelected = selectedFacilityId === facility.id;
                      const isAcademic = zone.id === "academic-zone";

                      return (
                        <div
                          key={facility.id}
                          onClick={() => handleSelectFacility(zone.id, facility.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                            isSelected
                              ? isAcademic
                                ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                                : "bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                              : "bg-slate-800/70 border-slate-800 hover:border-blue-400 hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <span className="text-xl p-2 rounded-xl bg-slate-700/80 shrink-0">
                                {facility.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-white">
                                    {facility.name}
                                  </h4>
                                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                                    {facility.badge || zone.shortName}
                                  </span>
                                </div>
                                <p className="text-[11px] text-blue-400 font-medium truncate mt-0.5">
                                  {facility.area}
                                </p>
                              </div>
                            </div>

                            {/* Live Status Badge */}
                            {facility.liveStatus && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{facility.liveStatus.badge}</span>
                              </span>
                            )}
                          </div>

                          {/* Signature What You Should Know */}
                          {facility.whatYouShouldKnow && (
                            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                              <span className="font-bold text-amber-400 flex items-center gap-1 mb-0.5">
                                <span>💡</span>
                                <span>What You Should Know</span>
                              </span>
                              {facility.whatYouShouldKnow}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* ========================================================= */
              /* 4. DEFAULT DIRECTORY VIEW WITH ZONE DIFFERENTIATION       */
              /* ========================================================= */
              <div className="space-y-4">
                {/* GPREC Visitor Welcome Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-800/60 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🏛️</span>
                      <div>
                        <h3 className="font-display font-bold text-xs sm:text-sm text-white">
                          GPREC Hackathon & Campus Hub
                        </h3>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {GPREC_INFO.visitorHighlight}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowOverview(!showOverview)}
                      className="text-[10px] font-semibold text-blue-400 hover:underline shrink-0 pt-0.5 cursor-pointer"
                    >
                      {showOverview ? "Less ▲" : "Key Facts ▼"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showOverview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-300"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="font-bold text-blue-400 block mb-0.5">
                              📍 Getting Here
                            </span>
                            <span>~6.5 km from Kurnool Railway Station & 5 km from APSRTC Bus Stand. Autos run 24/7.</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="font-bold text-blue-400 block mb-0.5">
                              📶 High-Speed Wi-Fi
                            </span>
                            <span>1 Gbps campus fiber with seamless coverage across lab floors and food court.</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* TWO CAMPUS ZONE SELECTOR TABS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAMPUS_ZONES.map((zone) => {
                    const isSelected = selectedZoneId === zone.id;
                    const isAcademic = zone.id === "academic-zone";

                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => {
                          setSelectedZoneId(zone.id);
                          if (!zone.facilities.some((f) => f.id === selectedFacilityId)) {
                            setSelectedFacilityId(zone.facilities[0].id);
                          }
                        }}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? isAcademic
                              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40"
                              : "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/40"
                            : "bg-slate-800/80 text-white border-slate-700/80 hover:border-blue-400 shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isSelected
                                  ? "bg-white/20 text-white border-white/30"
                                  : isAcademic
                                  ? "bg-blue-950 text-blue-300 border-blue-800"
                                  : "bg-emerald-950 text-emerald-300 border-emerald-800"
                              }`}
                            >
                              {zone.badge}
                            </span>
                            <span className="text-xl">{zone.icon}</span>
                          </div>

                          <h3 className="font-display font-bold text-xs sm:text-sm tracking-tight">
                            {zone.name}
                          </h3>
                          <p
                            className={`text-[10.5px] mt-1 leading-relaxed ${
                              isSelected ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {zone.subtitle}
                          </p>
                        </div>

                        <div
                          className={`mt-2.5 pt-2 border-t text-[10px] font-semibold flex items-center justify-between ${
                            isSelected
                              ? "border-white/20 text-white"
                              : "border-slate-700 text-blue-400"
                          }`}
                        >
                          <span>{zone.facilities.length} Verified Hubs</span>
                          <span>{isSelected ? "Active View ✓" : "Explore →"}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ACTIVE ZONE DETAIL LIST (DIFFERENTIATED VISUALS) */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-display font-bold text-xs text-white flex items-center gap-2">
                      <span>{activeZone.icon}</span>
                      <span>{activeZone.name}</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      {activeZone.facilities.length} locations
                    </span>
                  </div>

                  {/* Animated Facilities Accordion */}
                  <div className="space-y-2.5">
                    {activeZone.facilities.map((fac) => {
                      const isExpanded = selectedFacilityId === fac.id;
                      const isAcademic = activeZone.id === "academic-zone";

                      return (
                        <div
                          key={fac.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isExpanded
                              ? isAcademic
                                ? "bg-blue-950/30 border-blue-500 shadow-md ring-1 ring-blue-500/40"
                                : "bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                              : "bg-slate-800/70 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {/* Card Header Tap Target */}
                          <button
                            type="button"
                            onClick={() => setSelectedFacilityId(fac.id)}
                            className="w-full p-3.5 text-left flex items-start justify-between gap-3 cursor-pointer"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <span className="text-lg p-2 rounded-xl bg-slate-700 shrink-0">
                                {fac.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                    {fac.name}
                                  </h4>
                                  {fac.badge && (
                                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                                      {fac.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-blue-400 font-medium truncate mt-0.5">
                                  {fac.area}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Live Status Tag */}
                              {fac.liveStatus && (
                                <span className="hidden sm:inline-flex text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>{fac.liveStatus.badge}</span>
                                </span>
                              )}
                              <span
                                className={`text-slate-400 text-xs transition-transform ${
                                  isExpanded ? "rotate-180 text-blue-400" : ""
                                }`}
                              >
                                ▼
                              </span>
                            </div>
                          </button>

                          {/* Expanded Detail Panel */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.18 }}
                                className="px-3.5 pb-3.5 pt-0 border-t border-slate-800 text-xs space-y-3"
                              >
                                {/* Signature Hackathon "What You Should Know" Callout */}
                                {fac.whatYouShouldKnow && (
                                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-900/60 text-slate-200 text-[11px] leading-relaxed mt-2.5 shadow-xs">
                                    <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-xs">
                                      <span>💡</span>
                                      <span>What You Should Know (Participant Guide)</span>
                                    </span>
                                    {fac.whatYouShouldKnow}
                                  </div>
                                )}

                                {/* ZONE 1: TECH SPECS (Data-dense utilitarian view) */}
                                {isAcademic && fac.techSpecs && (
                                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                                      <IconCpu className="w-3 h-3" />
                                      <span>Technical & Infrastructure Specs</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                                      {Object.entries(fac.techSpecs).map(([key, val]) => (
                                        <div key={key} className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                                          <span className="text-slate-400 capitalize block text-[9.5px]">
                                            {key.replace(/([A-Z])/g, " $1")}:
                                          </span>
                                          <span className="font-medium text-slate-200">{val}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* ZONE 2: AMENITY TAGS (Warm lifestyle & venue view) */}
                                {!isAcademic && fac.amenityTags && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    {fac.amenityTags.map((tag, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] font-semibold px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                                      >
                                        ✓ {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Highlights Bullet Points */}
                                <div className="space-y-1 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                    Key Highlights
                                  </span>
                                  {fac.highlights.map((h, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-1.5 text-[11px] text-slate-300"
                                    >
                                      <span className="text-blue-400 font-bold shrink-0">•</span>
                                      <span className="leading-relaxed">{h}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Footer Action Bar */}
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] text-slate-400">
                                    {fac.liveStatus?.text || "Official GPREC verified guide"}
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
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. MODAL FOOTER                                           */}
        {/* ========================================================= */}
        <footer className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">GPREC Interactive Navigation • Coders' Club GPREC</span>
          </div>

          <a
            href={GPREC_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:underline font-semibold shrink-0 ml-2"
          >
            <span>gprec.ac.in</span>
            <IconExternal className="w-3 h-3" />
          </a>
        </footer>
      </motion.div>
    </div>
  );
}
