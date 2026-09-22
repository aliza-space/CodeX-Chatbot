import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CAMPUS_ZONES,
  calculateCampusRoute
} from "../../data/campusGuideData.js";
import { useChatStream } from "../../hooks/useChatStream.js";
import { useModalBackHandler } from "../../hooks/useModalBackHandler.js";
import CampusInteractiveMap from "./CampusInteractiveMap.jsx";
import {
  IconCross,
  IconSparkles
} from "../common/Icons.jsx";

const CATEGORIES = [
  { id: "all", label: "All Spots", icon: "📍" },
  { id: "hackathon", label: "Coding Arena", icon: "💻" },
  { id: "venues", label: "Venues & Halls", icon: "🎭" },
  { id: "food", label: "Dining & Canteen", icon: "🍔" },
  { id: "library", label: "Library", icon: "📚" },
  { id: "startups", label: "Labs & Innovation", icon: "🚀" },
];

export default function CampusGuideModal({ isOpen, onClose, initialDestinationId }) {
  useModalBackHandler(isOpen, onClose);

  const [selectedFacilityId, setSelectedFacilityId] = useState("csm-labs");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const { sendMessage } = useChatStream();

  // All campus facilities flat list
  const allFacilities = useMemo(() => {
    const list = [];
    for (const zone of CAMPUS_ZONES) {
      for (const f of zone.facilities) {
        list.push({ ...f, zoneName: zone.name, zoneBadge: zone.badge });
      }
    }
    return list;
  }, []);

  // Filtered facilities
  const filteredFacilities = useMemo(() => {
    return allFacilities.filter((f) => {
      const matchCat =
        selectedCategory === "all" ||
        f.category === selectedCategory ||
        (selectedCategory === "hackathon" && f.isHackathonHub);

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.area.toLowerCase().includes(q) ||
        (f.keywords && f.keywords.some((k) => k.toLowerCase().includes(q)));

      return matchCat && matchQuery;
    });
  }, [allFacilities, selectedCategory, searchQuery]);

  // Active selected facility object
  const activeFacility = useMemo(() => {
    return allFacilities.find((f) => f.id === selectedFacilityId) || allFacilities[0];
  }, [allFacilities, selectedFacilityId]);

  // Page title
  useEffect(() => {
    if (isOpen) {
      const prevTitle = document.title;
      document.title = "GPREC Campus Navigation & Walking Guide";
      return () => {
        document.title = prevTitle;
      };
    }
  }, [isOpen]);

  // Initial destination sync
  useEffect(() => {
    if (isOpen && initialDestinationId) {
      if (initialDestinationId === "auditorium" || initialDestinationId.includes("audi")) {
        setSelectedFacilityId("auditorium");
      } else if (initialDestinationId === "csm-labs" || initialDestinationId.includes("csm")) {
        setSelectedFacilityId("csm-labs");
      } else {
        setSelectedFacilityId(initialDestinationId);
      }
    } else if (isOpen) {
      setSelectedFacilityId("csm-labs");
    }
  }, [isOpen, initialDestinationId]);

  const handleSelectFacility = (zoneId, facilityId) => {
    setSelectedFacilityId(facilityId);
    setIsDirectoryOpen(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-40"
      />

      {/* Main Walking Navigation Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-5xl h-[100dvh] sm:h-[94vh] sm:max-h-[900px] bg-[#060c18] rounded-none sm:rounded-3xl border-0 sm:border border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden text-slate-100"
      >
        {/* TOP HEADER */}
        <header className="px-3 py-2.5 sm:px-5 sm:py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0 border border-slate-700/80 active:scale-95"
              title="Go back to chat"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 text-base shrink-0">
              🧭
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-xs sm:text-base text-white tracking-tight flex items-center gap-2 truncate">
                <span>GPREC Walking Navigation</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  Live Steps
                </span>
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                G. Pulla Reddy Engineering College, Kurnool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDirectoryOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <span>🏛️</span>
              <span>Browse Spots</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Close"
            >
              <IconCross className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* FULL IMMERSIVE INTERACTIVE WALKING MAP */}
        <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col">
          <CampusInteractiveMap
            selectedFacilityId={selectedFacilityId}
            onSelectFacility={handleSelectFacility}
            onAskBuddy={handleAskAboutFacility}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
          />
        </div>

        {/* SLIDE-OVER DIRECTORY DRAWER (CLEAN SPOT PICKER) */}
        <AnimatePresence>
          {isDirectoryOpen && (
            <>
              {/* Drawer Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDirectoryOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col p-4 overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">Campus Locations</h3>
                      <p className="text-[11px] text-slate-400">Select any spot to navigate</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDirectoryOpen(false)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
                  >
                    <IconCross className="w-4 h-4" />
                  </button>
                </div>

                {/* Search & Categories */}
                <div className="py-3 space-y-2 shrink-0">
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 text-xs">🔍</span>
                    <input
                      type="text"
                      placeholder="Search labs, auditorium, canteen, library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-800 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 shrink-0 ${
                          selectedCategory === cat.id
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spots List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {filteredFacilities.map((facility) => {
                    const isSelected = selectedFacilityId === facility.id;
                    const distRoute = calculateCampusRoute("node_main_gate", facility.id);

                    return (
                      <div
                        key={facility.id}
                        onClick={() => {
                          setSelectedFacilityId(facility.id);
                          setIsDirectoryOpen(false);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-blue-950/60 border-blue-500 shadow-md ring-2 ring-blue-500/40"
                            : "bg-slate-800/70 border-slate-700/60 hover:bg-slate-800 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl p-2 rounded-xl bg-slate-700/80 shrink-0">
                            {facility.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                {facility.name}
                              </h4>
                              {isSelected && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                  Selected ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {facility.area}
                            </p>
                          </div>
                        </div>

                        {distRoute?.success && (
                          <span className="text-[10px] font-bold text-blue-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700 shrink-0">
                            {distRoute.totalDistanceMeters}m
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
