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
import { IconSparkles } from "../common/Icons.jsx";

const GPREC_LAT = GPREC_INFO?.gps?.lat || 15.8073;
const GPREC_LNG = GPREC_INFO?.gps?.lng || 78.0375;

function googleMapsDestUrl(destNodeId) {
  const node = CAMPUS_NAV_NODES[destNodeId];
  if (node?.lat && node?.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${node.lat},${node.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${GPREC_LAT},${GPREC_LNG}`;
}

function googleMapsDirectionsUrl(userLat, userLng) {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/${userLat},${userLng}/${GPREC_LAT},${GPREC_LNG}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${GPREC_LAT},${GPREC_LNG}`;
}

export default function CampusInteractiveMap({
  selectedFacilityId,
  onSelectFacility,
  onAskBuddy,
  onOpenDirectory
}) {
  // Navigation state
  const [startNodeId, setStartNodeId] = useState("node_main_gate");
  const [destId, setDestId] = useState(
    selectedFacilityId === "auditorium" ? "node_auditorium_entry" : "node_csm_entry"
  );
  const [showSteps, setShowSteps] = useState(false);

  // Live GPS tracking state
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle | requesting | on_campus | off_campus | denied
  const [userGpsCoords, setUserGpsCoords] = useState(null);
  const [userMapCoords, setUserMapCoords] = useState(null);
  const watchIdRef = useRef(null);

  // Phone Motion & Accelerometer Step Tracking
  const [isMotionTracking, setIsMotionTracking] = useState(false);
  const [stepsTaken, setStepsTaken] = useState(0);
  const lastStepTimeRef = useRef(0);
  const lastMagRef = useRef(9.8);

  // Map pan & zoom with mobile touch support
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const touchStartDistRef = useRef(null);
  const mapSvgRef = useRef(null);

  // Sync destination
  useEffect(() => {
    if (selectedFacilityId) {
      const resolved = resolveToNodeId(selectedFacilityId);
      setDestId(resolved);
      setStepsTaken(0);
    }
  }, [selectedFacilityId]);

  // GPS lat/lng to SVG projection
  const GPS_BOUNDS = {
    latMin: 15.8065, latMax: 15.8103,
    lngMin: 78.0362, lngMax: 78.0402,
    svgX0: 160, svgX1: 840,
    svgY0: 100, svgY1: 640,
  };

  function gpsToSvg(lat, lng) {
    const x = GPS_BOUNDS.svgX0 + ((lng - GPS_BOUNDS.lngMin) / (GPS_BOUNDS.lngMax - GPS_BOUNDS.lngMin)) * (GPS_BOUNDS.svgX1 - GPS_BOUNDS.svgX0);
    const y = GPS_BOUNDS.svgY1 - ((lat - GPS_BOUNDS.latMin) / (GPS_BOUNDS.latMax - GPS_BOUNDS.latMin)) * (GPS_BOUNDS.svgY1 - GPS_BOUNDS.svgY0);
    return {
      x: Math.max(160, Math.min(840, Math.round(x))),
      y: Math.max(90, Math.min(640, Math.round(y)))
    };
  }

  // ── Phone Accelerometer Footstep Detection ──────────────────────────────
  const startPhoneMotionTracking = async () => {
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState !== "granted") return;
      } catch (err) {
        console.warn("DeviceMotionEvent permission error:", err);
      }
    }
    setIsMotionTracking(true);
    startLiveGpsWatch();
  };

  const stopPhoneMotionTracking = () => {
    setIsMotionTracking(false);
  };

  const handleToggleMotionTracking = () => {
    if (isMotionTracking) {
      stopPhoneMotionTracking();
    } else {
      startPhoneMotionTracking();
    }
  };

  useEffect(() => {
    if (!isMotionTracking) return;

    const handleDeviceMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;
      const { x, y, z } = acc;
      if (x === null || y === null || z === null) return;

      const mag = Math.sqrt(x * x + y * y + z * z);
      const delta = Math.abs(mag - lastMagRef.current);
      lastMagRef.current = mag;

      const now = Date.now();
      // Natural walking cadence threshold
      if (delta > 1.85 && now - lastStepTimeRef.current > 300) {
        lastStepTimeRef.current = now;
        setStepsTaken((prev) => prev + 1);
      }
    };

    window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [isMotionTracking]);

  const handleManualStep = () => {
    setStepsTaken((prev) => prev + 1);
  };

  const handleResetSteps = () => {
    setStepsTaken(0);
  };

  // ── Continuous GPS Tracker ──────────────────────────────────────────────
  const startLiveGpsWatch = () => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }

    setGpsStatus("requesting");

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserGpsCoords({ lat, lng });

        const dLat = (lat - GPREC_LAT) * 111000;
        const dLng = (lng - GPREC_LNG) * 111000 * Math.cos(lat * (Math.PI / 180));
        const distMeters = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distMeters < 1800) {
          let nearest = "node_main_gate";
          let minDist = Infinity;
          for (const [nid, node] of Object.entries(CAMPUS_NAV_NODES)) {
            const nd = Math.sqrt(
              Math.pow((lat - node.lat) * 111000, 2) +
              Math.pow((lng - node.lng) * 111000 * Math.cos(lat * (Math.PI / 180)), 2)
            );
            if (nd < minDist) { minDist = nd; nearest = nid; }
          }
          setStartNodeId(nearest);
          setUserMapCoords(gpsToSvg(lat, lng));
          setGpsStatus("on_campus");
        } else {
          setGpsStatus("off_campus");
          setStartNodeId("node_main_gate");
          setUserMapCoords(null);
        }
      },
      () => {
        setGpsStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 4000 }
    );
  };

  const stopLiveGpsWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGpsStatus("idle");
    setUserGpsCoords(null);
    setUserMapCoords(null);
  };

  const handleToggleGps = () => {
    if (gpsStatus === "on_campus" || gpsStatus === "off_campus" || gpsStatus === "requesting") {
      stopLiveGpsWatch();
    } else {
      startLiveGpsWatch();
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // ── Route & Progress Calculation ─────────────────────────────────────────
  const routeData = useMemo(() => {
    if (!startNodeId || !destId) return null;
    return calculateCampusRoute(startNodeId, destId);
  }, [startNodeId, destId]);

  const routePathString = useMemo(() => {
    if (!routeData?.points || routeData.points.length < 2) return "";
    return routeData.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [routeData]);

  const totalStepsRequired = useMemo(() => {
    const meters = routeData?.totalDistanceMeters || 100;
    return Math.max(1, Math.round(meters / 0.75));
  }, [routeData]);

  const walkProgress = useMemo(() => {
    if (totalStepsRequired <= 0) return 0;
    return Math.min(1, stepsTaken / totalStepsRequired);
  }, [stepsTaken, totalStepsRequired]);

  // Current interpolated position of the walker along the route
  const activeWalkerPos = useMemo(() => {
    if (!routeData?.points || routeData.points.length < 2) return null;
    if (walkProgress <= 0) return routeData.points[0];
    if (walkProgress >= 1) return routeData.points[routeData.points.length - 1];

    const pts = routeData.points;
    const totalSegments = pts.length - 1;
    const currentSegmentIndex = Math.min(totalSegments - 1, Math.floor(walkProgress * totalSegments));
    const segT = (walkProgress * totalSegments) - currentSegmentIndex;

    const p0 = pts[currentSegmentIndex];
    const p1 = pts[currentSegmentIndex + 1];

    return {
      x: p0.x + (p1.x - p0.x) * segT,
      y: p0.y + (p1.y - p0.y) * segT
    };
  }, [routeData, walkProgress]);

  const remainingDistanceMeters = useMemo(() => {
    const total = routeData?.totalDistanceMeters || 0;
    return Math.max(0, Math.round(total * (1 - walkProgress)));
  }, [routeData, walkProgress]);

  const remainingFootsteps = useMemo(() => {
    return Math.max(0, totalStepsRequired - stepsTaken);
  }, [totalStepsRequired, stepsTaken]);

  const isCompleted = walkProgress >= 1;

  // Next landmark direction hint
  const nextStepHint = useMemo(() => {
    if (!routeData?.steps || routeData.steps.length === 0) return "Follow Central Avenue to your destination.";
    if (isCompleted) return "🎉 You have arrived at your destination!";
    const stepIdx = Math.min(
      routeData.steps.length - 1,
      Math.floor(walkProgress * routeData.steps.length)
    );
    return routeData.steps[stepIdx];
  }, [routeData, walkProgress, isCompleted]);

  // Locations & Metadata
  const startLocationInfo = useMemo(() =>
    CAMPUS_LOCATIONS.find((l) => l.id === startNodeId) || {
      name: CAMPUS_NAV_NODES[startNodeId]?.label || "Start Point",
      shortName: gpsStatus === "on_campus" ? "My Location" : "Main Gate",
      icon: gpsStatus === "on_campus" ? "📍" : "🚪",
    }, [startNodeId, gpsStatus]);

  const destLocationInfo = useMemo(() =>
    CAMPUS_LOCATIONS.find((l) => l.id === destId || l.facilityId === destId) || {
      name: CAMPUS_NAV_NODES[destId]?.label || "Destination",
      shortName: "Destination",
      icon: "🎯",
    }, [destId]);

  const activeDestinationFacility = useMemo(() => {
    const match = findFacilityAndZone(destId);
    return match?.facility || null;
  }, [destId]);

  const handleSelectBuildingDestination = (markerId) => {
    const resolved = resolveToNodeId(markerId);
    setDestId(resolved);
    setStepsTaken(0);
    if (onSelectFacility) {
      const match = findFacilityAndZone(markerId);
      if (match) onSelectFacility(match.zone.id, match.facility.id);
    }
  };

  // ── Mouse & Touch Gesture Handlers (Pinch-to-zoom + Touch Pan) ───────────
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = dist / touchStartDistRef.current;
      setZoom((z) => Math.max(0.65, Math.min(3.0, z * (factor > 1 ? 1.03 : 0.97))));
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  const handleZoomIn    = () => setZoom((z) => Math.min(3.0, z + 0.25));
  const handleZoomOut   = () => setZoom((z) => Math.max(0.65, z - 0.25));
  const handleResetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const destCoords = CAMPUS_NAV_NODES[destId] || routeData?.points?.[routeData.points.length - 1] || null;

  return (
    <div className="relative flex flex-col w-full h-full min-h-0 bg-[#060c18] text-slate-100 rounded-none sm:rounded-2xl overflow-hidden select-none touch-none">

      {/* ================================================================ */}
      {/* 1. MOBILE-FIRST TOP HUD (TURN DIRECTION & TARGET PICKER)         */}
      {/* ================================================================ */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-30 flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl pointer-events-auto flex items-center justify-between gap-2">
          
          {/* Target Selector */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-lg sm:text-xl p-1.5 sm:p-2 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 shrink-0">
              {destLocationInfo.icon || "🎯"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0">Target:</span>
                <select
                  value={destId}
                  onChange={(e) => {
                    setDestId(e.target.value);
                    setStepsTaken(0);
                    const match = findFacilityAndZone(e.target.value);
                    if (match && onSelectFacility) onSelectFacility(match.zone.id, match.facility.id);
                  }}
                  className="bg-transparent text-slate-100 text-xs sm:text-sm font-bold outline-none cursor-pointer w-full truncate appearance-none"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={`dest-${loc.id}`} value={loc.id} className="bg-slate-900 text-slate-100 font-medium">
                      {loc.icon} {loc.name}
                    </option>
                  ))}
                </select>
                <span className="text-slate-400 text-xs pointer-events-none">▼</span>
              </div>

              {/* Turn-by-Turn Instruction */}
              <p className="text-[10.5px] sm:text-[11.5px] text-emerald-400 font-medium truncate flex items-center gap-1 mt-0.5">
                <span>🚶</span>
                <span className="truncate">{nextStepHint}</span>
              </p>
            </div>
          </div>

          {/* Quick Spots & GPS Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {onOpenDirectory && (
              <button
                type="button"
                onClick={onOpenDirectory}
                className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer active:scale-95"
                title="Browse GPREC Campus Locations"
              >
                <span>🏛️</span>
                <span className="hidden sm:inline">Spots</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleGps}
              className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer border active:scale-95 ${
                gpsStatus === "on_campus"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                  : gpsStatus === "requesting"
                  ? "bg-amber-600 text-white border-amber-500 animate-pulse"
                  : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:border-blue-500"
              }`}
              title="Toggle Live GPS"
            >
              <span>{gpsStatus === "on_campus" ? "📍" : "🛰️"}</span>
              <span className="hidden sm:inline">{gpsStatus === "on_campus" ? "GPS On" : "GPS"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. AUTHENTIC GPREC CAMPUS MAP (IMMERSIVE & MOBILE SCALED)        */}
      {/* ================================================================ */}
      <div
        className="relative flex-1 w-full h-full min-h-[300px] sm:min-h-[440px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dot Matrix Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Dynamic Zoom & Pan Transform Layer */}
        <div
          ref={mapSvgRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="w-full h-full flex items-center justify-center pointer-events-auto p-1 sm:p-2"
        >
          {/* Authentic GPREC Campus Layout SVG ViewBox */}
          <svg
            viewBox="150 70 760 620"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full max-w-full max-h-full object-contain"
            style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.75))" }}
          >
            <defs>
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="walkerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="campusBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#065f46" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* GPREC Campus Perimeter Wall */}
            <rect x="160" y="75" width="740" height="605" rx="28" fill="#09111e" stroke="#1e293b" strokeWidth="2.5" />
            <rect x="166" y="81" width="728" height="593" rx="24" fill="none" stroke="url(#campusBorder)" strokeWidth="1.5" strokeDasharray="8 6" />

            {/* GPREC Lush Greenery & Lawns */}
            {CAMPUS_MAP_DATA.greenery.map((g) => (
              <g key={g.id} className="opacity-75 pointer-events-none">
                {g.r ? (
                  <circle cx={g.cx} cy={g.cy} r={g.r} fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                ) : (
                  <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={g.rx} fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                )}
                {g.label && (
                  <text x={g.cx || g.x + g.w / 2} y={g.cy || g.y + g.h / 2} textAnchor="middle" dominantBaseline="middle"
                    fill="#34d399" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">
                    {g.label}
                  </text>
                )}
              </g>
            ))}

            {/* GPREC Campus Walkways & Roads */}
            {CAMPUS_MAP_DATA.roads.map((road) => (
              <path key={road.id} d={road.d} stroke="#18253a" strokeWidth={road.width} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
            {CAMPUS_MAP_DATA.roads.map((road) => (
              <path key={`dash-${road.id}`} d={road.d} stroke="#2a3b52" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}

            {/* Authentic GPREC Landmark Road Names */}
            <text x="500" y="525" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1">CENTRAL AVENUE</text>
            <text x="475" y="465" textAnchor="end" fill="#475569" fontSize="9.5" fontFamily="sans-serif">FOOD PLAZA</text>
            <text x="690" y="415" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="sans-serif">INNOVATION WAY</text>

            {/* GPREC Department Buildings */}
            {CAMPUS_MAP_DATA.buildings.map((b) => {
              const isSelected = destId === b.nodeId || destId === b.markerId;
              const isStart    = startNodeId === b.nodeId || startNodeId === b.markerId;
              const isKey      = b.markerId === "csm-labs" || b.markerId === "auditorium";

              return (
                <g key={b.id} onClick={() => handleSelectBuildingDestination(b.markerId)} className="cursor-pointer group">
                  {(isSelected || isStart) && (
                    <rect x={b.x - 5} y={b.y - 5} width={b.w + 10} height={b.h + 10} rx="15"
                      fill={isStart ? "rgba(34,211,238,0.25)" : b.markerId === "auditorium" ? "rgba(168,85,247,0.3)" : "rgba(251,191,36,0.25)"}
                    />
                  )}
                  <rect
                    x={b.x} y={b.y} width={b.w} height={b.h} rx="10"
                    fill={isStart ? "#0c4a6e" : isSelected ? (b.markerId === "auditorium" ? "#581c87" : "#78350f") : isKey ? "#0f1f36" : "#0a1525"}
                    stroke={isStart ? "#22d3ee" : isSelected ? (b.markerId === "auditorium" ? "#c084fc" : "#fbbf24") : isKey ? "#3b82f6" : "#253448"}
                    strokeWidth={isSelected || isStart ? "2.5" : isKey ? "1.8" : "1.2"}
                    className="group-hover:stroke-blue-400 group-hover:fill-slate-800 transition-all"
                  />
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 - 5} textAnchor="middle"
                    fill={isKey || isSelected || isStart ? "#ffffff" : "#94a3b8"} fontSize="12" fontFamily="monospace" fontWeight="bold" className="pointer-events-none select-none">
                    {b.code}
                  </text>
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 13} textAnchor="middle"
                    fill={isSelected || isStart ? "#e2e8f0" : isKey ? "#cbd5e1" : "#64748b"} fontSize="9" fontFamily="sans-serif" fontWeight={isKey ? "600" : "500"} className="pointer-events-none select-none">
                    {b.name.length > 18 ? b.name.slice(0, 16) + "…" : b.name}
                  </text>
                </g>
              );
            })}

            {/* Active Walking Route Polyline */}
            {routePathString && (
              <g>
                <path d={routePathString} stroke="#22d3ee" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35" filter="url(#routeGlow)" />
                <path d={routePathString} stroke="#0369a1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d={routePathString} stroke="#38bdf8" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-pulse" />
                <circle r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5">
                  <animateMotion
                    dur={`${Math.max(2, Math.min(6.5, (routeData?.points?.length || 2) * 0.9))}s`}
                    repeatCount="indefinite"
                    path={routePathString}
                  />
                </circle>
                {routeData?.points?.map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
                ))}
              </g>
            )}

            {/* Real-time Footstep User Marker */}
            {activeWalkerPos && (
              <g transform={`translate(${activeWalkerPos.x}, ${activeWalkerPos.y})`} filter="url(#walkerGlow)">
                {isMotionTracking && (
                  <circle r="26" fill="#22d3ee" opacity="0.3" className="animate-ping" />
                )}
                <circle r="16" fill="#0891b2" opacity="0.9" />
                <circle r="8" fill="#22d3ee" stroke="#ffffff" strokeWidth="2.5" />
                <g transform="translate(0, -28)">
                  <rect x="-38" y="-12" width="76" height="20" rx="10" fill="#083344" stroke="#22d3ee" strokeWidth="1.5" />
                  <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="#cffafe" fontSize="8.5" fontWeight="bold">
                    {stepsTaken > 0 ? `👣 ${stepsTaken} STEPS` : "📍 YOU"}
                  </text>
                </g>
              </g>
            )}

            {/* Destination Target Marker */}
            {destCoords && (
              <g transform={`translate(${destCoords.x}, ${destCoords.y})`}>
                <circle r="20" fill="#f59e0b" opacity="0.35" className="animate-ping" />
                <circle r="12" fill="#d97706" opacity="0.85" />
                <circle r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2.5" />
                <g transform="translate(0, -26)">
                  <rect x="-38" y="-12" width="76" height="19" rx="9.5" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#fef3c7" fontSize="8.5" fontWeight="bold">
                    TARGET 🎯
                  </text>
                </g>
              </g>
            )}

            {/* GPREC Main Gate (Nandyal Rd) */}
            <g transform="translate(500, 672)">
              <rect x="-75" y="-9" width="150" height="17" rx="8.5" fill="#0a1320" stroke="#253448" strokeWidth="1" />
              <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="8.5" fontWeight="bold">MAIN GATE (NANDYAL RD)</text>
            </g>
          </svg>
        </div>

        {/* Floating Zoom Controls (Touch Friendly) */}
        <div className="absolute right-2 sm:right-3 top-20 sm:top-24 flex flex-col gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md shadow-md z-20">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm transition cursor-pointer active:scale-95"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm transition cursor-pointer active:scale-95"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetView}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 flex items-center justify-center text-xs font-bold transition cursor-pointer active:scale-95"
            title="Reset to Full Campus View"
          >
            ⌖
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 3. MOBILE-OPTIMIZED BOTTOM NAVIGATION CONTROLS                   */}
      {/* ================================================================ */}
      <div className="p-2.5 sm:p-3.5 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/90 border-t border-slate-800/90 backdrop-blur-md flex flex-col gap-2 shrink-0 z-30">
        
        {/* Distance Metrics & Primary Mobile Actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Distance and Footstep count */}
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
              <span>{remainingDistanceMeters}m</span>
              <span className="text-xs font-semibold text-cyan-300">({remainingFootsteps} steps)</span>
            </span>
            <span className="text-[10.5px] font-medium text-slate-400">
              {isCompleted ? "🎉 Arrived at destination!" : `~${Math.max(1, Math.round(remainingDistanceMeters / 75))} min walk from here`}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Real Footstep Motion Tracking */}
            <button
              onClick={handleToggleMotionTracking}
              type="button"
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer border active:scale-95 shadow-md ${
                isMotionTracking
                  ? "bg-emerald-600 text-white border-emerald-400 animate-pulse shadow-emerald-500/30"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500/60"
              }`}
            >
              <span>{isMotionTracking ? "👣" : "📱"}</span>
              <span>{isMotionTracking ? "Tracking Walk" : "Track My Steps"}</span>
            </button>

            {/* Manual +1 Step Button */}
            <button
              onClick={handleManualStep}
              type="button"
              className="px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 active:scale-95 transition cursor-pointer"
              title="Add 1 step forward manually"
            >
              +1 Step
            </button>

            {/* Reset Button */}
            {stepsTaken > 0 && (
              <button
                onClick={handleResetSteps}
                type="button"
                className="p-1.5 sm:p-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 active:scale-95 transition cursor-pointer"
                title="Reset steps"
              >
                ↺
              </button>
            )}

            {/* External Google Maps Route */}
            <a
              href={gpsStatus === "off_campus" && userGpsCoords ? googleMapsDirectionsUrl(userGpsCoords.lat, userGpsCoords.lng) : googleMapsDestUrl(destId)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50 flex items-center justify-center transition active:scale-95 shadow-xs"
              title="Open Google Maps directions"
            >
              🗺️
            </a>
          </div>
        </div>

        {/* Live Footstep Progress Bar */}
        {stepsTaken > 0 && (
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isCompleted ? "bg-emerald-400" : "bg-gradient-to-r from-cyan-400 to-blue-500"}`}
              style={{ width: `${Math.round(walkProgress * 100)}%` }}
            />
          </div>
        )}

        {/* Turn-by-Turn Expandable Steps */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="text-slate-400 hover:text-slate-200 underline cursor-pointer text-left"
          >
            {showSteps ? "Hide walking steps ▲" : "View turn-by-turn walking steps ▼"}
          </button>
          {onAskBuddy && (
            <button
              type="button"
              onClick={() => onAskBuddy(activeDestinationFacility || destLocationInfo)}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <IconSparkles className="w-3 h-3" />
              <span>Ask CodeX Buddy</span>
            </button>
          )}
        </div>

        {/* Step List Drawer */}
        <AnimatePresence>
          {showSteps && routeData?.steps && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1 text-xs max-h-28 overflow-y-auto scrollbar-thin pt-1 text-slate-300"
            >
              {routeData.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-900 text-blue-300 text-[8.5px] font-bold flex items-center justify-center shrink-0 mt-0.5">
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
