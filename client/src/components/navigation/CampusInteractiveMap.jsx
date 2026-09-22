import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CAMPUS_MAP_DATA,
  CAMPUS_NAV_NODES,
  CAMPUS_LOCATIONS,
  calculateCampusRoute,
  findFacilityAndZone,
  resolveToNodeId,
  GPREC_INFO
} from "../../data/campusGuideData.js";
import {
  IconSparkles
} from "../common/Icons.jsx";

export default function CampusInteractiveMap({
  selectedFacilityId,
  onSelectFacility,
  onAskBuddy
}) {
  // Navigation State: Start Node and Destination Node/Facility
  const [startNodeId, setStartNodeId] = useState("node_main_gate");
  const [destId, setDestId] = useState(
    selectedFacilityId === "auditorium" ? "node_auditorium_entry" : "node_csm_entry"
  );
  const [showSteps, setShowSteps] = useState(false);

  // Live GPS Tracking State
  const [gpsStatus, setGpsStatus] = useState("idle"); // 'idle' | 'tracking' | 'on_campus' | 'off_campus' | 'denied'
  const [gpsToast, setGpsToast] = useState(null); // { type: 'info'|'warning'|'success', message: '' }

  // Map Pan & Zoom Viewport
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapSvgRef = useRef(null);

  // Sync destination when parent selection changes
  useEffect(() => {
    if (selectedFacilityId) {
      const resolved = resolveToNodeId(selectedFacilityId);
      setDestId(resolved);
    }
  }, [selectedFacilityId]);

  // Live Geolocation Watcher
  const handleToggleGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      setGpsToast({
        type: "warning",
        message: "Geolocation is not supported by your browser."
      });
      return;
    }

    if (gpsStatus === "tracking" || gpsStatus === "on_campus") {
      setGpsStatus("idle");
      setStartNodeId("node_main_gate");
      setGpsToast(null);
      return;
    }

    setGpsStatus("tracking");
    setGpsToast({
      type: "info",
      message: "Detecting your live position on GPREC campus..."
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Distance from GPREC center (15.8073, 78.0375) in meters
        const dLat = (latitude - GPREC_INFO.gps.lat) * 111000;
        const dLng = (longitude - GPREC_INFO.gps.lng) * 111000 * Math.cos(latitude * (Math.PI / 180));
        const distMeters = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distMeters < 1500) {
          // Snap to nearest campus waypoint
          let nearest = "node_main_gate";
          let minDist = Infinity;
          for (const [nid, node] of Object.entries(CAMPUS_NAV_NODES)) {
            const ndLat = (latitude - node.lat) * 111000;
            const ndLng = (longitude - node.lng) * 111000 * Math.cos(latitude * (Math.PI / 180));
            const d = Math.sqrt(ndLat * ndLat + ndLng * ndLng);
            if (d < minDist) {
              minDist = d;
              nearest = nid;
            }
          }
          setStartNodeId(nearest);
          setGpsStatus("on_campus");
          setGpsToast({
            type: "success",
            message: `Live on campus: Near ${CAMPUS_NAV_NODES[nearest]?.label || "GPREC Campus"}`
          });
        } else {
          setGpsStatus("off_campus");
          setStartNodeId("node_main_gate");
          setGpsToast({
            type: "warning",
            message: "Off-campus position detected. Defaulting Start to Main Gate."
          });
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setGpsStatus("denied");
        setStartNodeId("node_main_gate");
        setGpsToast({
          type: "warning",
          message: "Location access denied. Defaulting Start to Main Gate."
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Swap Start and Destination points
  const handleSwapPoints = () => {
    const temp = startNodeId;
    setStartNodeId(destId);
    setDestId(temp);
    const match = findFacilityAndZone(temp);
    if (match && onSelectFacility) {
      onSelectFacility(match.zone.id, match.facility.id);
    }
  };

  // Calculate Route between Start Node and Destination Node across any combination
  const routeData = useMemo(() => {
    if (!startNodeId || !destId) return null;
    return calculateCampusRoute(startNodeId, destId);
  }, [startNodeId, destId]);

  // SVG Polyline string for the route path
  const routePathString = useMemo(() => {
    if (!routeData?.points || routeData.points.length < 2) return "";
    return routeData.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [routeData]);

  // Selected Start & Destination Info Objects
  const startLocationInfo = useMemo(() => {
    return CAMPUS_LOCATIONS.find((l) => l.id === startNodeId) || {
      name: CAMPUS_NAV_NODES[startNodeId]?.label || "Start Point",
      shortName: "Start",
      icon: "📍"
    };
  }, [startNodeId]);

  const destLocationInfo = useMemo(() => {
    return CAMPUS_LOCATIONS.find((l) => l.id === destId || l.facilityId === destId) || {
      name: CAMPUS_NAV_NODES[destId]?.label || "Destination",
      shortName: "Destination",
      icon: "🎯"
    };
  }, [destId]);

  const activeDestinationFacility = useMemo(() => {
    const match = findFacilityAndZone(destId);
    return match?.facility || null;
  }, [destId]);

  // Map Pan Drag Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.4, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, z - 0.25));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Select destination from building clicks
  const handleSelectBuildingDestination = (markerId) => {
    const resolved = resolveToNodeId(markerId);
    setDestId(resolved);
    if (onSelectFacility) {
      const match = findFacilityAndZone(markerId);
      if (match) onSelectFacility(match.zone.id, match.facility.id);
    }
  };

  const startPointCoords = CAMPUS_NAV_NODES[startNodeId] || CAMPUS_NAV_NODES.node_main_gate;
  const destCoords = CAMPUS_NAV_NODES[destId] || routeData?.points?.[routeData.points.length - 1] || null;

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-slate-950 text-slate-100 rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* ========================================================= */}
      {/* 1. TOP BAR: COMPACT, CLEAN ROUTE PICKER (FROM / TO / GPS) */}
      {/* ========================================================= */}
      <div className="p-2 sm:p-3 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-2">
          {/* Start and End Selectors */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {/* Start Point */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span className="text-[10.5px] font-bold text-blue-300 uppercase tracking-wider shrink-0 w-8">
                From
              </span>
              <select
                value={startNodeId}
                onChange={(e) => {
                  setStartNodeId(e.target.value);
                  setGpsStatus("idle");
                  setGpsToast(null);
                }}
                className="bg-transparent text-slate-100 text-xs font-semibold outline-none cursor-pointer w-full truncate appearance-none"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={`start-${loc.id}`} value={loc.id} className="bg-slate-900 text-slate-100">
                    {loc.icon} {loc.name}
                  </option>
                ))}
              </select>
              <span className="text-slate-400 text-[10px] pointer-events-none shrink-0">▼</span>
            </div>

            {/* Destination Point */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-[10.5px] font-bold text-amber-300 uppercase tracking-wider shrink-0 w-8">
                To
              </span>
              <select
                value={destId}
                onChange={(e) => {
                  setDestId(e.target.value);
                  const match = findFacilityAndZone(e.target.value);
                  if (match && onSelectFacility) {
                    onSelectFacility(match.zone.id, match.facility.id);
                  }
                }}
                className="bg-transparent text-slate-100 text-xs font-semibold outline-none cursor-pointer w-full truncate appearance-none"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={`dest-${loc.id}`} value={loc.id} className="bg-slate-900 text-slate-100">
                    {loc.icon} {loc.name}
                  </option>
                ))}
              </select>
              <span className="text-slate-400 text-[10px] pointer-events-none shrink-0">▼</span>
            </div>
          </div>

          {/* Quick Actions Stack: Swap + GPS */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleSwapPoints}
              title="Swap Start & Destination"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-xs flex items-center justify-center font-bold"
            >
              ⇅
            </button>

            <button
              type="button"
              onClick={handleToggleGps}
              title="Toggle Live GPS Location"
              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer border ${
                gpsStatus === "on_campus"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-500/30"
                  : gpsStatus === "tracking"
                  ? "bg-amber-600 text-white border-amber-500 animate-pulse shadow-sm shadow-amber-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-blue-400"
              }`}
            >
              {gpsStatus === "on_campus" ? "📍" : "🛰️"}
            </button>
          </div>
        </div>

        {/* GPS Status Floating Toast Banner */}
        <AnimatePresence>
          {gpsToast && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className={`px-2.5 py-1.5 rounded-xl border backdrop-blur-md flex items-center justify-between gap-2 text-[11px] shadow-sm overflow-hidden ${
                gpsToast.type === "success"
                  ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                  : "bg-slate-800/90 border-blue-500/40 text-blue-200"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="shrink-0">📍</span>
                <span className="truncate leading-tight font-medium">
                  {gpsToast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGpsToast(null)}
                className="p-0.5 text-slate-400 hover:text-white rounded transition cursor-pointer shrink-0"
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE VECTOR MAP CANVAS                          */}
      {/* ========================================================= */}
      <div
        className="relative flex-1 min-h-[220px] sm:min-h-[260px] w-full bg-[#070d18] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cyberpunk Map Grid Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        {/* Map Viewport Transform Container */}
        <div
          ref={mapSvgRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out"
          }}
          className="w-full h-full flex items-center justify-center pointer-events-auto"
        >
          <svg
            viewBox={CAMPUS_MAP_DATA.viewBox}
            className="w-[1000px] h-[720px] max-w-none"
            style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.6))" }}
          >
            <defs>
              {/* Route Glow Filter */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Campus Boundary Gradient */}
              <linearGradient id="campusBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#065f46" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Campus Perimeter Boundary */}
            <rect
              x="80"
              y="60"
              width="840"
              height="620"
              rx="30"
              fill="#0b1324"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <rect
              x="86"
              y="66"
              width="828"
              height="608"
              rx="26"
              fill="none"
              stroke="url(#campusBorder)"
              strokeWidth="2"
              strokeDasharray="8 6"
            />

            {/* Greenery / Landscaped Lawns */}
            {CAMPUS_MAP_DATA.greenery.map((g) => (
              <g key={g.id} className="opacity-70 pointer-events-none">
                {g.r ? (
                  <circle cx={g.cx} cy={g.cy} r={g.r} fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                ) : (
                  <rect
                    x={g.x}
                    y={g.y}
                    width={g.w}
                    height={g.h}
                    rx={g.rx}
                    fill="#064e3b"
                    stroke="#059669"
                    strokeWidth="1.5"
                  />
                )}
                {g.label && (
                  <text
                    x={g.cx || g.x + g.w / 2}
                    y={g.cy || g.y + g.h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    opacity="0.8"
                  >
                    {g.label}
                  </text>
                )}
              </g>
            ))}

            {/* Road & Walkway Base Layer */}
            {CAMPUS_MAP_DATA.roads.map((road) => (
              <path
                key={road.id}
                d={road.d}
                stroke="#1e293b"
                strokeWidth={road.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}

            {/* Walkway Center Dashes */}
            {CAMPUS_MAP_DATA.roads.map((road) => (
              <path
                key={`dash-${road.id}`}
                d={road.d}
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}

            {/* Road Labels */}
            <text x="500" y="525" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif" fontWeight="600" letterSpacing="1">
              CENTRAL AVENUE
            </text>
            <text x="475" y="465" textAnchor="end" fill="#64748b" fontSize="9" fontFamily="sans-serif">
              FOOD PLAZA
            </text>
            <text x="690" y="415" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif">
              INNOVATION WAY
            </text>

            {/* Campus Buildings & Footprints */}
            {CAMPUS_MAP_DATA.buildings.map((b) => {
              const isSelected = destId === b.nodeId || destId === b.markerId;
              const isStart = startNodeId === b.nodeId || startNodeId === b.markerId;
              const isKeyBuilding = b.markerId === "csm-labs" || b.markerId === "auditorium";

              return (
                <g
                  key={b.id}
                  onClick={() => handleSelectBuildingDestination(b.markerId)}
                  className="cursor-pointer transition-opacity duration-200 hover:opacity-100"
                >
                  {/* Building Base Glow on selection */}
                  {(isSelected || isStart) && (
                    <rect
                      x={b.x - 4}
                      y={b.y - 4}
                      width={b.w + 8}
                      height={b.h + 8}
                      rx="14"
                      fill={
                        isStart
                          ? "rgba(56, 189, 248, 0.4)"
                          : b.markerId === "auditorium"
                          ? "rgba(168, 85, 247, 0.4)"
                          : "rgba(245, 158, 11, 0.4)"
                      }
                    />
                  )}
                  {/* Building Block Body */}
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx="9"
                    fill={
                      isStart
                        ? "#0369a1"
                        : isSelected
                        ? b.markerId === "auditorium"
                          ? "#6b21a8"
                          : "#b45309"
                        : isKeyBuilding
                        ? "#1e293b"
                        : "#0f172a"
                    }
                    stroke={
                      isStart
                        ? "#38bdf8"
                        : isSelected
                        ? b.markerId === "auditorium"
                          ? "#d8b4fe"
                          : "#fde68a"
                        : isKeyBuilding
                        ? "#3b82f6"
                        : "#334155"
                    }
                    strokeWidth={isSelected || isStart ? "2.5" : isKeyBuilding ? "1.8" : "1"}
                    className="hover:stroke-blue-400 hover:fill-slate-800 transition-all"
                  />
                  {/* Building Code */}
                  <text
                    x={b.x + b.w / 2}
                    y={b.y + b.h / 2 - 4}
                    textAnchor="middle"
                    fill={isKeyBuilding || isSelected || isStart ? "#ffffff" : "#94a3b8"}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {b.code}
                  </text>
                  {/* Building Name */}
                  <text
                    x={b.x + b.w / 2}
                    y={b.y + b.h / 2 + 12}
                    textAnchor="middle"
                    fill={isSelected || isStart ? "#e2e8f0" : isKeyBuilding ? "#cbd5e1" : "#64748b"}
                    fontSize="8.5"
                    fontFamily="sans-serif"
                    fontWeight={isKeyBuilding ? "600" : "500"}
                    className="pointer-events-none select-none"
                  >
                    {b.name.length > 18 ? b.name.slice(0, 16) + "…" : b.name}
                  </text>
                </g>
              );
            })}

            {/* ========================================================= */}
            {/* ANIMATED MULTI-HOP WALKWAY ROUTE                          */}
            {/* ========================================================= */}
            {routePathString && (
              <g>
                {/* Route Glow Underlay */}
                <path
                  d={routePathString}
                  stroke="#38bdf8"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity="0.45"
                  filter="url(#routeGlow)"
                />
                {/* Base Route Solid Line */}
                <path
                  d={routePathString}
                  stroke="#0284c7"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Progressive Animated Dashed Route Line */}
                <path
                  id="activeWalkwayRoute"
                  d={routePathString}
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="animate-pulse"
                />

                {/* Moving Traveler Beacon Dot along the route */}
                <circle r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5">
                  <animateMotion
                    dur={`${Math.max(2.5, Math.min(6.5, (routeData?.points?.length || 2) * 0.9))}s`}
                    repeatCount="indefinite"
                    path={routePathString}
                  />
                </circle>

                {/* Intermediate waypoint nodes */}
                {routeData?.points?.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#38bdf8"
                    stroke="#0369a1"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )}

            {/* ========================================================= */}
            {/* "YOU ARE HERE / START" PULSATING START BEACON             */}
            {/* ========================================================= */}
            {startPointCoords && (
              <g transform={`translate(${startPointCoords.x}, ${startPointCoords.y})`}>
                <circle r="22" fill="#38bdf8" opacity="0.35" className="animate-ping" />
                <circle r="14" fill="#0284c7" opacity="0.65" />
                <circle r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
                <g transform="translate(0, -24)">
                  <rect x="-36" y="-12" width="72" height="18" rx="9" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#f0f9ff" fontSize="8.5" fontWeight="bold" letterSpacing="0.5">
                    START
                  </text>
                </g>
              </g>
            )}

            {/* ========================================================= */}
            {/* DESTINATION PIN MARKER (ANIMATED PULSE)                   */}
            {/* ========================================================= */}
            {destCoords && (
              <g transform={`translate(${destCoords.x}, ${destCoords.y})`}>
                <circle r="18" fill="#f59e0b" opacity="0.35" className="animate-ping" />
                <circle r="10" fill="#d97706" opacity="0.8" />
                <circle r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2.5" />
                <g transform="translate(0, -26)">
                  <rect x="-42" y="-14" width="84" height="18" rx="9" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="0" y="-1" textAnchor="middle" dominantBaseline="middle" fill="#fef3c7" fontSize="8.5" fontWeight="bold" letterSpacing="0.5">
                    DESTINATION
                  </text>
                </g>
              </g>
            )}

            {/* Entrance Gate Marker Label */}
            <g transform="translate(500, 675)">
              <rect x="-80" y="-10" width="160" height="18" rx="9" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                MAIN GATE (NANDYAL RD)
              </text>
            </g>
          </svg>
        </div>

        {/* Floating Zoom & Recenter Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold text-sm shadow-md transition cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold text-sm shadow-md transition cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetView}
            className="w-8 h-8 rounded-xl bg-slate-900/90 text-blue-400 border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold text-xs shadow-md transition cursor-pointer"
            title="Recenter Map"
          >
            ⌖
          </button>
        </div>

        {/* Mini Compass / Orientation HUD */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shadow-sm">
          <span className="text-blue-400 font-bold">▲ N</span>
          <span>| GPREC CAMPUS</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LIVE ROUTE STATS & STEP-BY-STEP DRAWER                 */}
      {/* ========================================================= */}
      <div className="p-2.5 sm:p-3 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex flex-col gap-2 shrink-0 z-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg p-2 rounded-xl bg-slate-800 shrink-0">
              {destLocationInfo.icon || "📍"}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {startLocationInfo.shortName} ➔ {destLocationInfo.shortName}
                </h4>
                {activeDestinationFacility?.facilityTag && (
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {activeDestinationFacility.facilityTag}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-400 font-medium truncate">
                {destLocationInfo.name}
              </p>
            </div>
          </div>

          {/* Synchronized Route Distance & ETA Pill */}
          {routeData?.success && (
            <div className="bg-blue-950/90 border border-blue-800 px-3 py-1 rounded-xl text-right shrink-0 shadow-xs">
              <div className="text-xs font-bold text-blue-300 flex items-center justify-end gap-1">
                <span>{routeData.totalDistanceMeters}m</span>
              </div>
              <div className="text-[10px] text-blue-400 font-medium">
                ~{routeData.estimatedMinutes} min walk
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="text-[11px] font-semibold text-slate-300 hover:text-white underline cursor-pointer"
          >
            {showSteps ? "Hide Walkway Steps ▲" : "View Turn-by-Turn Route ▼"}
          </button>

          {onAskBuddy && (
            <button
              type="button"
              onClick={() => onAskBuddy(activeDestinationFacility || destLocationInfo)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xs active:scale-95 transition cursor-pointer"
            >
              <IconSparkles className="w-3.5 h-3.5" />
              <span>Ask CodeX Buddy</span>
            </button>
          )}
        </div>

        {/* Turn-by-turn Step List */}
        <AnimatePresence>
          {showSteps && routeData?.steps && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300 max-h-28 overflow-y-auto scrollbar-thin"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Walkway Route Steps ({startLocationInfo.shortName} → {destLocationInfo.shortName})
              </div>
              {routeData.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-blue-900 text-blue-300 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-tight text-slate-200">{step}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
