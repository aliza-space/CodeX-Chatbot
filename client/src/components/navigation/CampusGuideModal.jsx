import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CAMPUS_ZONES,
  calculateCampusRoute,
  GPREC_INFO
} from "../../data/campusGuideData.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import CampusInteractiveMap from "./CampusInteractiveMap.jsx";
import {
  IconCross,
  IconSparkles,
  IconExternal
} from "../common/Icons.jsx";

// Find CSM and Auditorium objects directly from dataset for high fidelity
const findFacilityById = (id) => {
  for (const zone of CAMPUS_ZONES) {
    const f = zone.facilities.find((item) => item.id === id);
    if (f) return { facility: f, zone };
  }
  return null;
};

export default function CampusGuideModal({ isOpen, onClose, initialDestinationId }) {
  // Destination state is centered around CSM Department or Auditorium
  const [selectedFacilityId, setSelectedFacilityId] = useState("csm-labs");
  const [expandedAmenityId, setExpandedAmenityId] = useState(null);
  const [mobileTab, setMobileTab] = useState("map"); // 'map' | 'guide'
  const { sendMessage } = useChatStream();

  // Primary destinations
  const csmData = useMemo(() => findFacilityById("csm-labs"), []);
  const auditoriumData = useMemo(() => findFacilityById("auditorium"), []);

  // Secondary campus essentials list
  const secondaryAmenities = useMemo(() => {
    const list = [];
    for (const zone of CAMPUS_ZONES) {
      for (const f of zone.facilities) {
        if (f.id !== "csm-labs" && f.id !== "auditorium") {
          list.push({ ...f, zoneName: zone.name, zoneBadge: zone.badge });
        }
      }
    }
    return list;
  }, []);

  // Dynamic Page Title
  useEffect(() => {
    if (isOpen) {
      const prevTitle = document.title;
      document.title = "GPREC Campus Guide & Navigation — CodeX Buddy";
      return () => {
        document.title = prevTitle;
      };
    }
  }, [isOpen]);

  // Sync initial target destination from chatbot trigger
  useEffect(() => {
    if (isOpen && initialDestinationId) {
      if (initialDestinationId === "auditorium" || initialDestinationId.includes("audi")) {
        setSelectedFacilityId("auditorium");
      } else {
        setSelectedFacilityId("csm-labs");
      }
    } else if (isOpen) {
      setSelectedFacilityId("csm-labs");
    }
  }, [isOpen, initialDestinationId]);

  const handleSelectFacility = (zoneId, facilityId) => {
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
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden text-slate-100"
      >
        {/* ========================================================= */}
        {/* 1. TOP HEADER                                             */}
        {/* ========================================================= */}
        <header className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 text-lg shrink-0">
              🧭
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 truncate">
                <span>GPREC Campus Guide & Navigation</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  Fixed Official Routes
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
            className={`w-full lg:w-[48%] h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 p-2.5 sm:p-3.5 bg-slate-950/60 min-h-0 overflow-y-auto ${
              mobileTab === "map" ? "flex" : "hidden lg:flex"
            }`}
          >
            <CampusInteractiveMap
              selectedFacilityId={selectedFacilityId}
              onSelectFacility={handleSelectFacility}
              onAskBuddy={handleAskAboutFacility}
            />
          </div>

          {/* RIGHT COLUMN: CLEAN DIRECTORY & KEY DESTINATIONS */}
          <div
            className={`flex-1 flex-col overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-slate-900 min-h-0 ${
              mobileTab === "guide" ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Primary Destinations Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Primary Destinations</span>
                </span>
                <span className="text-[10px] text-blue-400 font-medium">
                  Select destination to map route
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. CSM Department Card */}
                {csmData && (() => {
                  const fac = csmData.facility;
                  const isSelected = selectedFacilityId === fac.id;
                  const distRoute = calculateCampusRoute("node_main_gate", fac.id);

                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacilityId(fac.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-3 ${
                        isSelected
                          ? "bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/40"
                          : "bg-slate-800/70 border-slate-800 hover:border-blue-400 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-2xl p-2.5 rounded-2xl bg-blue-600/20 text-blue-300 border border-blue-500/30 shrink-0">
                            {fac.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-white">
                                {fac.name}
                              </h3>
                              {isSelected && (
                                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                                  Active Destination ✓
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <p className="text-xs text-blue-400 font-medium">
                                {fac.area}
                              </p>
                              {distRoute?.success && (
                                <span className="text-[10px] font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700">
                                  📍 {distRoute.totalDistanceMeters}m • ~{distRoute.estimatedMinutes}m from Main Gate
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {fac.facilityTag && (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 shrink-0">
                            {fac.facilityTag}
                          </span>
                        )}
                      </div>

                      {/* What You Should Know */}
                      {fac.whatYouShouldKnow && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-amber-900/60 text-slate-200 text-xs leading-relaxed">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-xs">
                            <span>💡</span>
                            <span>What You Should Know</span>
                          </span>
                          {fac.whatYouShouldKnow}
                        </div>
                      )}

                      {/* Floor-Ordered Scannable Highlights */}
                      <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Floor Layout & Facilities
                        </span>
                        {fac.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-200"
                          >
                            <span className="text-xs shrink-0 mt-0.5">
                              {h.icon || "•"}
                            </span>
                            <span className="leading-relaxed">{h.text || h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Ask CodeBuddy Action Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Primary arena for CodeX rounds
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAskAboutFacility(fac);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xs active:scale-95 transition cursor-pointer"
                        >
                          <IconSparkles className="w-3.5 h-3.5" />
                          <span>Ask CodeX Buddy</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Auditorium Card */}
                {auditoriumData && (() => {
                  const fac = auditoriumData.facility;
                  const isSelected = selectedFacilityId === fac.id;
                  const distRoute = calculateCampusRoute("node_main_gate", fac.id);

                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacilityId(fac.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-3 ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-500 shadow-md ring-2 ring-purple-500/40"
                          : "bg-slate-800/70 border-slate-800 hover:border-purple-400 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-2xl p-2.5 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30 shrink-0">
                            {fac.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-white">
                                {fac.name}
                              </h3>
                              {isSelected && (
                                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-xs">
                                  Active Destination ✓
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <p className="text-xs text-purple-300 font-medium">
                                {fac.area}
                              </p>
                              {distRoute?.success && (
                                <span className="text-[10px] font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700">
                                  📍 {distRoute.totalDistanceMeters}m • ~{distRoute.estimatedMinutes}m from Main Gate
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {fac.facilityTag && (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                            {fac.facilityTag}
                          </span>
                        )}
                      </div>

                      {/* What You Should Know */}
                      {fac.whatYouShouldKnow && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-purple-900/60 text-slate-200 text-xs leading-relaxed">
                          <span className="font-bold text-purple-300 flex items-center gap-1.5 mb-1 text-xs">
                            <span>💡</span>
                            <span>What You Should Know</span>
                          </span>
                          {fac.whatYouShouldKnow}
                        </div>
                      )}

                      {/* Highlights */}
                      <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Auditorium Key Specifications
                        </span>
                        {fac.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-200"
                          >
                            <span className="text-xs shrink-0 mt-0.5">
                              {h.icon || "•"}
                            </span>
                            <span className="leading-relaxed">{h.text || h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Ask CodeBuddy Action Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Opening Ceremony & Keynote Arena
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAskAboutFacility(fac);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-xs active:scale-95 transition cursor-pointer"
                        >
                          <IconSparkles className="w-3.5 h-3.5" />
                          <span>Ask CodeX Buddy</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Secondary Campus Venues & Amenities (Clean Compact List) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>Other Campus Locations</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {secondaryAmenities.length} landmarks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {secondaryAmenities.map((amenity) => {
                  const distRoute = calculateCampusRoute("node_main_gate", amenity.id);
                  const isExpanded = expandedAmenityId === amenity.id;

                  return (
                    <div
                      key={amenity.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition space-y-2 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg p-1.5 rounded-lg bg-slate-700 shrink-0">
                            {amenity.icon}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {amenity.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {amenity.area}
                            </p>
                          </div>
                        </div>
                        {distRoute?.success && (
                          <span className="text-[9px] font-semibold text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                            {distRoute.totalDistanceMeters}m
                          </span>
                        )}
                      </div>

                      <p className="text-[10.5px] text-slate-300 line-clamp-2 leading-relaxed">
                        {amenity.summary || amenity.whatYouShouldKnow}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setExpandedAmenityId(isExpanded ? null : amenity.id)}
                          className="text-blue-400 hover:underline font-semibold cursor-pointer"
                        >
                          {isExpanded ? "Hide Details ▲" : "View Details ▼"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAskAboutFacility(amenity)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          Ask Buddy →
                        </button>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2 border-t border-slate-700 text-[10.5px] text-slate-300 space-y-1.5"
                          >
                            <div>{amenity.whatYouShouldKnow}</div>
                            {amenity.facilityTag && (
                              <div className="text-blue-300 font-semibold">
                                Tag: {amenity.facilityTag}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. MODAL FOOTER                                           */}
        {/* ========================================================= */}
        <footer className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">GPREC Interactive Navigation • Fixed Official Routes</span>
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
