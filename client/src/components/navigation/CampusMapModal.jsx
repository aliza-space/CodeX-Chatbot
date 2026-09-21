import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  useCompass,
  calculateBearing,
  getRelativeAngle,
  getWalkingCue,
} from "../../hooks/useCompass.js";
import {
  IconMap,
  IconPin,
  IconCompass,
  IconNavigation,
  IconSearch,
  IconCross,
  IconCpu,
  IconUtensils,
  IconTrophy,
  IconGuide
} from "../common/Icons.jsx";

// Official GPREC Kurnool Campus Coordinates
export const GPREC_CAMPUS = {
  name: "G. Pulla Reddy Engineering College",
  shortName: "GPREC Campus",
  lat: 15.7747,
  lng: 78.0567,
  gateLat: 15.7760,
  gateLng: 78.0564,
};

// Curated GPREC Campus Destinations with Exact Entrance Coordinates & Cyber Categorization
export const CAMPUS_DESTINATIONS = [
  {
    id: "csm-labs",
    name: "CSM Labs & Hackathon Arena",
    shortName: "CSM Labs (Intel Hub)",
    floor: "2nd Floor (Intel Lab 6) & Ground Fl",
    category: "Hackathon Hub",
    color: "#06b6d4",
    lat: 15.7744,
    lng: 78.0572,
    walkHint: "Pass Admin block, enter CSM front portico, take central stairs to 2nd Floor.",
  },
  {
    id: "csm-department",
    name: "CSM Department Office (HOD)",
    shortName: "CSM Dept Office",
    floor: "Ground Floor, CSM Block",
    category: "Academic",
    color: "#3b82f6",
    lat: 15.7745,
    lng: 78.0570,
    walkHint: "Enter CSM main portico. HOD Office is in the right ground floor corridor.",
  },
  {
    id: "food-court",
    name: "Campus Food Court",
    shortName: "Food Court",
    floor: "Central Amenities Plaza",
    category: "Dining",
    color: "#10b981",
    lat: 15.7733,
    lng: 78.0576,
    walkHint: "Take eastern pathway past library toward Student Activity Plaza.",
  },
  {
    id: "cafeteria",
    name: "Main Cafeteria & Canteen",
    shortName: "Main Canteen",
    floor: "South-East Dining Block",
    category: "Dining",
    color: "#10b981",
    lat: 15.7738,
    lng: 78.0572,
    walkHint: "Walk past library garden, take right near the shaded banyan tree.",
  },
  {
    id: "auditorium",
    name: "Silver Jubilee Auditorium",
    shortName: "Auditorium",
    floor: "Ground Level (Main Hall)",
    category: "Events",
    color: "#8b5cf6",
    lat: 15.7754,
    lng: 78.0558,
    walkHint: "80m from Main Gate, adjacent to Administrative Block left wing.",
  },
  {
    id: "amphitheatre",
    name: "Open Air Amphitheatre",
    shortName: "Amphitheatre",
    floor: "East Campus Quadrangle",
    category: "Events",
    color: "#8b5cf6",
    lat: 15.7743,
    lng: 78.0578,
    walkHint: "Stone-paved path east of central library garden.",
  },
  {
    id: "central-library",
    name: "Central Library & Digital Wing",
    shortName: "Central Library",
    floor: "Ground & 1st Floor, West Wing",
    category: "Academic",
    color: "#3b82f6",
    lat: 15.7748,
    lng: 78.0558,
    walkHint: "Follow main central avenue 120m straight from gate. Double glass doors.",
  },
  {
    id: "cse-block",
    name: "CSE Department Block",
    shortName: "CSE Block",
    floor: "Ground, 1st & 2nd Floors",
    category: "Academic",
    color: "#3b82f6",
    lat: 15.7746,
    lng: 78.0565,
    walkHint: "Adjacent to Central Library along the main academic walkway.",
  },
  {
    id: "admin-block",
    name: "Administrative Block (Principal)",
    shortName: "Admin Block",
    floor: "Ground & 1st Floor",
    category: "Academic",
    color: "#3b82f6",
    lat: 15.7756,
    lng: 78.0562,
    walkHint: "First major building on your left after entering GPREC Main Gate.",
  },
  {
    id: "ece-eee-block",
    name: "ECE & EEE Department Block",
    shortName: "ECE / EEE Block",
    floor: "Ground to 3rd Floor",
    category: "Academic",
    color: "#3b82f6",
    lat: 15.7750,
    lng: 78.0574,
    walkHint: "North-east academic quadrangle opposite sports ground pathway.",
  },
  {
    id: "mech-civil-block",
    name: "Mechanical & Civil Block",
    shortName: "Mech & Civil Block",
    floor: "Ground to 2nd Floor",
    category: "Academic",
    color: "#3b82f6",
    lat: 15.7735,
    lng: 78.0560,
    walkHint: "South-west quadrangle near the workshop road.",
  },
  {
    id: "indoor-stadium",
    name: "Indoor Sports Stadium & Gym",
    shortName: "Indoor Stadium",
    floor: "Ground Level",
    category: "Sports",
    color: "#f59e0b",
    lat: 15.7730,
    lng: 78.0582,
    walkHint: "South-eastern corner of campus behind the food court plaza.",
  },
  {
    id: "sports-ground",
    name: "College Sports & Cricket Ground",
    shortName: "Sports Ground",
    floor: "Open Field",
    category: "Sports",
    color: "#f59e0b",
    lat: 15.7758,
    lng: 78.0585,
    walkHint: "Eastern boundary of campus past the ECE block.",
  },
  {
    id: "boys-hostel",
    name: "GPREC Boys Hostel Complex",
    shortName: "Boys Hostel",
    floor: "Hostel Blocks A, B & C",
    category: "Hostels",
    color: "#64748b",
    lat: 15.7725,
    lng: 78.0568,
    walkHint: "Southern edge of campus past the cafeteria.",
  },
  {
    id: "girls-hostel",
    name: "GPREC Girls Hostel Complex",
    shortName: "Girls Hostel",
    floor: "Gated Hostel Campus",
    category: "Hostels",
    color: "#64748b",
    lat: 15.7728,
    lng: 78.0552,
    walkHint: "South-western campus perimeter with secure dedicated gate.",
  },
  {
    id: "atm-health",
    name: "Canara Bank ATM & Health Centre",
    shortName: "ATM & Dispensary",
    floor: "Ground Floor (Near Gate)",
    category: "Amenities",
    color: "#06b6d4",
    lat: 15.7758,
    lng: 78.0560,
    walkHint: "Immediately inside the Main Gate on the right side.",
  },
  {
    id: "main-gate",
    name: "GPREC Main Gate & Security",
    shortName: "Main Gate",
    floor: "Entrance Arch",
    category: "Entrance",
    color: "#06b6d4",
    lat: 15.7760,
    lng: 78.0564,
    walkHint: "Main campus security gate on Nandyal Road.",
  },
];

const CATEGORIES = ["All", "Hackathon Hub", "Dining", "Events", "Academic", "Sports", "Hostels"];

// Calculate Haversine distance in meters
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
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
}

export default function CampusMapModal({ isOpen, onClose, initialDestinationId }) {
  // Destination selection
  const [selectedDest, setSelectedDest] = useState(
    CAMPUS_DESTINATIONS.find((d) => d.id === initialDestinationId) || CAMPUS_DESTINATIONS[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Live Real-Time Continuous User GPS Tracking
  const [userLocation, setUserLocation] = useState({
    lat: GPREC_CAMPUS.gateLat,
    lng: GPREC_CAMPUS.gateLng,
    isReal: false,
    accuracy: 8,
  });
  const [gpsActive, setGpsActive] = useState(false);

  // Walking Polyline Points
  const [routePoints, setRoutePoints] = useState([]);

  // Live Compass Hook
  const compass = useCompass();

  // Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const venueMarkersRef = useRef([]);
  const routeLineRef = useRef(null);
  const watchIdRef = useRef(null);
  const isAutoPanningRef = useRef(true);

  // Sync initialDestinationId
  useEffect(() => {
    if (initialDestinationId) {
      const match = CAMPUS_DESTINATIONS.find((d) => d.id === initialDestinationId);
      if (match) setSelectedDest(match);
    }
  }, [initialDestinationId]);

  // Continuous High-Accuracy Live GPS Watch
  useEffect(() => {
    if (!isOpen || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isReal: true,
          accuracy: Math.round(pos.coords.accuracy || 6),
        };
        setUserLocation(coords);
        setGpsActive(true);

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
        }

        if (isAutoPanningRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.panTo([coords.lat, coords.lng], { animate: true, duration: 0.5 });
        }
      },
      () => {
        setGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isOpen]);

  // Active start coordinates (live GPS if active, otherwise Main Gate)
  const activeStartPoint = useMemo(() => {
    if (gpsActive && userLocation.isReal) {
      return { lat: userLocation.lat, lng: userLocation.lng };
    }
    return { lat: GPREC_CAMPUS.gateLat, lng: GPREC_CAMPUS.gateLng };
  }, [gpsActive, userLocation]);

  // Fetch walking path via OSRM Foot Profile
  useEffect(() => {
    if (!isOpen || !selectedDest) return;

    let active = true;
    const startLat = activeStartPoint.lat;
    const startLng = activeStartPoint.lng;
    const endLat = selectedDest.lat;
    const endLng = selectedDest.lng;

    const url = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
          const latLngs = data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          setRoutePoints(latLngs);
        } else {
          setRoutePoints([
            [startLat, startLng],
            [endLat, endLng],
          ]);
        }
      })
      .catch(() => {
        if (active) {
          setRoutePoints([
            [startLat, startLng],
            [endLat, endLng],
          ]);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, selectedDest, activeStartPoint]);

  // Helper to create holographic custom venue marker HTML
  const createVenuePinHtml = (venue, isTarget = false) => {
    const isSpecial = venue.id === "csm-labs";
    const pinColor = isSpecial ? "#06b6d4" : venue.color || "#3b82f6";
    const bgGlow = isTarget ? "ring-4 ring-cyan-400/80 scale-110 shadow-cyan-500/50" : "shadow-md";

    return `
      <div class="holo-pin-container ${isTarget ? "scale-110" : ""}">
        <div class="px-2 py-0.5 rounded-lg bg-[#070d1a]/90 text-white text-[10px] font-mono font-bold whitespace-nowrap mb-1 border border-cyan-500/40 shadow-lg backdrop-blur-md">
          ${venue.shortName || venue.name}
        </div>
        <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-white ${bgGlow} transition-all" style="background: ${pinColor};">
          ${isSpecial ? '<span class="absolute -inset-1 rounded-full animate-ping opacity-75 bg-cyan-400"></span>' : ''}
          <div class="w-3 h-3 rounded-full bg-white shadow-xs"></div>
        </div>
      </div>
    `;
  };

  // Initialize Map Canvas
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {}
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [GPREC_CAMPUS.lat, GPREC_CAMPUS.lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 20,
      minZoom: 15,
    });

    // Dark/Clean Google Roadmap tiles
    L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
    }).addTo(map);

    // Zoom controls on right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Cyber Live GPS User Dot
    const userIcon = L.divIcon({
      className: "cyber-user-dot-container",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="cyber-user-halo"></span>
          <span class="cyber-user-dot"></span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    userMarkerRef.current = L.marker([activeStartPoint.lat, activeStartPoint.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Add all Venue Pins with Click Handlers
    venueMarkersRef.current = [];
    CAMPUS_DESTINATIONS.forEach((dest) => {
      const isTarget = dest.id === selectedDest.id;
      const pinIcon = L.divIcon({
        className: "custom-venue-pin",
        html: createVenuePinHtml(dest, isTarget),
        iconSize: [40, 50],
        iconAnchor: [20, 48],
      });

      const marker = L.marker([dest.lat, dest.lng], {
        icon: pinIcon,
        zIndexOffset: isTarget ? 950 : 800,
      }).addTo(map);

      marker.on("click", () => {
        setSelectedDest(dest);
      });

      venueMarkersRef.current.push({ id: dest.id, marker });
    });

    // Clean Cyber Walking Polyline
    routeLineRef.current = L.polyline([], {
      color: "#06b6d4",
      weight: 5,
      opacity: 0.9,
      lineCap: "round",
      dashArray: "6, 8",
    }).addTo(map);

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
      fitRouteOnScreen();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update venue markers, user position, and polyline when state changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([activeStartPoint.lat, activeStartPoint.lng]);
    }

    // Refresh venue marker icons
    venueMarkersRef.current.forEach(({ id, marker }) => {
      const venue = CAMPUS_DESTINATIONS.find((d) => d.id === id);
      if (venue) {
        const isTarget = id === selectedDest.id;
        const pinIcon = L.divIcon({
          className: "custom-venue-pin",
          html: createVenuePinHtml(venue, isTarget),
          iconSize: [40, 50],
          iconAnchor: [20, 48],
        });
        marker.setIcon(pinIcon);
        marker.setZIndexOffset(isTarget ? 950 : 800);
      }
    });

    if (routeLineRef.current && routePoints.length >= 2) {
      routeLineRef.current.setLatLngs(routePoints);
    }
  }, [selectedDest, activeStartPoint, routePoints]);

  // Frame route on screen
  const fitRouteOnScreen = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([
      [activeStartPoint.lat, activeStartPoint.lng],
      [selectedDest.lat, selectedDest.lng],
    ]);
    mapInstanceRef.current.fitBounds(bounds, {
      paddingTopLeft: [40, 70],
      paddingBottomRight: [40, 150],
      maxZoom: 19,
    });
  };

  // Recenter on user's current live location
  const handleRecenterUser = () => {
    if (!mapInstanceRef.current) return;
    isAutoPanningRef.current = true;
    mapInstanceRef.current.flyTo([activeStartPoint.lat, activeStartPoint.lng], 18, { duration: 0.6 });
  };

  if (!isOpen) return null;

  // Real-time Distance & Walking calculations
  const distanceMeters = calculateDistanceMeters(
    activeStartPoint.lat,
    activeStartPoint.lng,
    selectedDest.lat,
    selectedDest.lng
  );
  const formattedDistance =
    distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`;
  const walkMinutes = Math.max(1, Math.round(distanceMeters / (1.25 * 60)));

  // Compass Bearing calculations
  const targetBearing = calculateBearing(
    activeStartPoint.lat,
    activeStartPoint.lng,
    selectedDest.lat,
    selectedDest.lng
  );
  const relativeAngle =
    compass.heading !== null
      ? getRelativeAngle(targetBearing, compass.heading)
      : targetBearing;
  const walkingCue = getWalkingCue(compass.heading !== null ? relativeAngle : null);

  const filteredPlaces = CAMPUS_DESTINATIONS.filter((d) => {
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(q) || d.floor?.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-0 sm:p-4">
      {/* Dark backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Futuristic Navigation Window */}
      <div className="relative w-full max-w-4xl h-[100dvh] sm:h-[90vh] sm:rounded-3xl bg-[#070d1a] overflow-hidden flex flex-col z-10 shadow-2xl border-0 sm:border border-cyan-500/30">
        {/* ========================================================= */}
        {/* 1. FUTURISTIC TOP BAR: Search Dropdown, Filters, GPS Pill  */}
        {/* ========================================================= */}
        <header className="relative z-30 bg-[#070d1a]/95 backdrop-blur-xl px-3 sm:px-5 py-3 border-b border-cyan-500/20 flex flex-col gap-2 shrink-0 shadow-lg text-white">
          <div className="flex items-center justify-between gap-2.5">
            {/* Back / Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800/80 text-cyan-400 hover:text-white hover:bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center transition shrink-0 cursor-pointer"
              aria-label="Close Map"
            >
              <IconCross className="w-4 h-4" />
            </button>

            {/* Futuristic Venue Selector Dropdown */}
            <div className="relative flex-1 max-w-md">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 text-left transition shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
                    <IconPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-display font-bold text-white truncate">
                      {selectedDest.name}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400 truncate">
                      {selectedDest.floor}
                    </div>
                  </div>
                </div>
                <span className={`text-slate-400 transition-transform font-mono text-xs ${dropdownOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown Options Drawer with Category Filters */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#0b1222] rounded-2xl shadow-2xl border border-cyan-500/30 z-50 max-h-80 overflow-y-auto p-2.5 scrollbar-thin text-slate-100"
                  >
                    {/* Search Field */}
                    <div className="mb-2 px-1 relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search venue, lab, food court..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-cyan-500/30 bg-[#070d1a] text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans"
                      />
                      <IconSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 px-1 mb-1 scrollbar-none">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold whitespace-nowrap transition ${
                            selectedCategory === cat
                              ? "bg-cyan-500 text-white"
                              : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Filtered Destinations List */}
                    <div className="space-y-1">
                      {filteredPlaces.map((place) => {
                        const isSelected = selectedDest.id === place.id;
                        return (
                          <button
                            key={place.id}
                            type="button"
                            onClick={() => {
                              setSelectedDest(place);
                              setDropdownOpen(false);
                              setSearchQuery("");
                            }}
                            className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2 transition cursor-pointer ${
                              isSelected
                                ? "bg-cyan-950/80 border border-cyan-500/50 text-cyan-300"
                                : "hover:bg-slate-800/60 text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                                <IconPin className="w-3 h-3" />
                              </div>
                              <div className="min-w-0">
                                <div className={`text-xs font-bold truncate ${isSelected ? "text-cyan-300" : "text-white"}`}>
                                  {place.name}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400 truncate">{place.floor}</div>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 shrink-0 uppercase px-1.5 py-0.5 rounded bg-slate-800">
                              {place.category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GPS Status Indicator & Recenter Action */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border ${
                  gpsActive
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
                title={gpsActive ? `Live GPS Radar (±${userLocation.accuracy}m)` : "Using Main Gate starting anchor"}
              >
                <span className={`w-2 h-2 rounded-full ${gpsActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                <span className="hidden sm:inline">{gpsActive ? "GPS LIVE" : "GATE ANCHOR"}</span>
              </div>

              <button
                type="button"
                onClick={handleRecenterUser}
                className="w-9 h-9 rounded-xl bg-slate-800/80 text-cyan-400 hover:text-white hover:bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center transition cursor-pointer"
                title="Recenter on current coordinates"
              >
                <IconNavigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. FULL-SCREEN INTERACTIVE CAMPUS RADAR CANVAS            */}
        {/* ========================================================= */}
        <div className="relative flex-1 w-full h-full bg-[#0a0f1d]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        {/* ========================================================= */}
        {/* 3. UNIFIED CYBER WALKING RADAR HUD (Bottom Card)          */}
        {/* ========================================================= */}
        <footer className="relative z-30 bg-[#070d1a]/95 backdrop-blur-xl border-t border-cyan-500/20 p-3.5 sm:p-4.5 flex flex-col gap-2.5 shrink-0 shadow-2xl text-white">
          <div className="flex items-center justify-between gap-3">
            {/* Target Destination Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-primary-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40 shrink-0">
                <IconPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-tight truncate">
                  {selectedDest.name}
                </h3>
                <p className="text-[11px] font-mono text-cyan-400 font-semibold truncate">
                  {selectedDest.floor}
                </p>
              </div>
            </div>

            {/* Live Compass Heading + Distance / ETA */}
            <div className="flex items-center gap-2.5 bg-[#0b1222] px-3.5 py-2 rounded-2xl border border-cyan-500/30 shrink-0 shadow-inner">
              {/* Rotating Compass Arrow */}
              <div
                className="w-6 h-6 flex items-center justify-center transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${relativeAngle}deg)` }}
                title={`Target Bearing: ${Math.round(targetBearing)}°`}
              >
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[14px] border-b-cyan-400" />
              </div>

              <div className="text-right font-mono">
                <div className="text-xs sm:text-sm font-bold text-white leading-none">
                  {formattedDistance}
                </div>
                <div className="text-[9px] text-cyan-400 font-semibold mt-0.5">
                  ~{walkMinutes} min walk
                </div>
              </div>
            </div>
          </div>

          {/* Concise Walking Guidance Step */}
          {selectedDest.walkHint && (
            <div className="flex items-center gap-2 bg-[#0c1426] p-2.5 rounded-xl text-xs text-slate-300 border border-cyan-500/20">
              <span className="text-cyan-400 font-mono font-bold shrink-0">PATH:</span>
              <span className="truncate flex-1 text-slate-200">{selectedDest.walkHint}</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {walkingCue}
              </span>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
