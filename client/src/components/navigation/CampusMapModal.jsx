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
  IconNavigation,
  IconSearch,
  IconCross
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

// Curated GPREC Campus Destinations
export const CAMPUS_DESTINATIONS = [
  {
    id: "csm-labs",
    name: "CSM Labs & Hackathon Arena",
    shortName: "CSM Labs (Intel Hub)",
    floor: "2nd Floor (Intel Lab 6) & Ground Fl",
    category: "Hackathon Hub",
    color: "#2563eb",
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
    color: "#0284c7",
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
    color: "#0284c7",
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

  // Active start coordinates
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

  // Helper to create clean venue marker HTML
  const createVenuePinHtml = (venue, isTarget = false) => {
    const isSpecial = venue.id === "csm-labs";
    const pinColor = isSpecial ? "#2563eb" : venue.color || "#475569";
    const bgGlow = isTarget ? "ring-4 ring-primary-400 scale-110 shadow-lg" : "shadow-md";

    return `
      <div class="venue-pin-container ${isTarget ? "scale-110" : ""}">
        <div class="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap mb-1 border border-slate-700 shadow-md">
          ${venue.shortName || venue.name}
        </div>
        <div class="relative w-7 h-7 rounded-full flex items-center justify-center text-white ${bgGlow} transition-all" style="background: ${pinColor};">
          ${isSpecial ? '<span class="absolute -inset-1 rounded-full animate-ping opacity-75 bg-primary-400"></span>' : ''}
          <div class="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></div>
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

    // Clean Google Roadmap tiles
    L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
    }).addTo(map);

    // Zoom controls on right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // User GPS Dot
    const userIcon = L.divIcon({
      className: "user-live-dot-container",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="user-live-halo"></span>
          <span class="user-live-dot"></span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    userMarkerRef.current = L.marker([activeStartPoint.lat, activeStartPoint.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Add all Venue Pins
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

    // Clean Walking Polyline
    routeLineRef.current = L.polyline([], {
      color: "#2563eb",
      weight: 5,
      opacity: 0.95,
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

  // Update venue markers and polyline
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Clean Walking Navigation Window */}
      <div className="relative w-full max-w-4xl h-[100dvh] sm:h-[90vh] sm:rounded-3xl bg-white dark:bg-slate-900 overflow-hidden flex flex-col z-10 shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800">
        {/* ========================================================= */}
        {/* 1. MINIMAL TOP BAR: Dropdown Picker, Search, GPS Pill     */}
        {/* ========================================================= */}
        <header className="relative z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0 shadow-xs">
          <div className="flex items-center justify-between gap-2.5">
            {/* Back / Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
              aria-label="Close Map"
            >
              <IconCross className="w-4 h-4" />
            </button>

            {/* Clean Venue Selector Dropdown */}
            <div className="relative flex-1 max-w-md">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-primary-500 text-left transition shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800">
                    <IconPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {selectedDest.name}
                    </div>
                    <div className="text-[10px] font-medium text-primary-600 dark:text-primary-400 truncate">
                      {selectedDest.floor}
                    </div>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Options Drawer with Category Filters */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-80 overflow-y-auto p-2.5 scrollbar-thin text-slate-800 dark:text-slate-100"
                  >
                    {/* Search Field */}
                    <div className="mb-2 px-1 relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search venue, lab, food court..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-500 font-sans"
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
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition ${
                            selectedCategory === cat
                              ? "bg-primary-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                                ? "bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                <IconPin className="w-3 h-3" />
                              </div>
                              <div className="min-w-0">
                                <div className={`text-xs font-bold truncate ${isSelected ? "text-primary-600 dark:text-primary-400" : "text-slate-800 dark:text-slate-100"}`}>
                                  {place.name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">{place.floor}</div>
                              </div>
                            </div>
                            <span className="text-[9px] font-medium text-slate-400 shrink-0 uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
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
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border ${
                  gpsActive
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                }`}
                title={gpsActive ? `Live GPS Active (±${userLocation.accuracy}m)` : "Using Main Gate starting anchor"}
              >
                <span className={`w-2 h-2 rounded-full ${gpsActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                <span className="hidden sm:inline">{gpsActive ? "GPS Active" : "Gate Mode"}</span>
              </div>

              <button
                type="button"
                onClick={handleRecenterUser}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary-600 flex items-center justify-center transition cursor-pointer"
                title="Recenter on current coordinates"
              >
                <IconNavigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. FULL-SCREEN CLEAN WALKING MAP CANVAS                   */}
        {/* ========================================================= */}
        <div className="relative flex-1 w-full h-full bg-[#f2efe9]">
          <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#f2efe9]" />
        </div>

        {/* ========================================================= */}
        {/* 3. UNIFIED WALKING RADAR HUD (Bottom Card)                */}
        {/* ========================================================= */}
        <footer className="relative z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 flex flex-col gap-2 shrink-0 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            {/* Target Destination Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 flex items-center justify-center shrink-0">
                <IconPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight truncate">
                  {selectedDest.name}
                </h3>
                <p className="text-[11px] text-primary-600 dark:text-primary-400 font-semibold truncate">
                  📍 {selectedDest.floor}
                </p>
              </div>
            </div>

            {/* Live Compass Heading + Distance / ETA */}
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/90 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
              {/* Rotating Compass Arrow */}
              <div
                className="w-5 h-5 flex items-center justify-center transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${relativeAngle}deg)` }}
                title={`Target Bearing: ${Math.round(targetBearing)}°`}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[12px] border-b-emerald-500" />
              </div>

              <div className="text-right font-mono">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {formattedDistance}
                </div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  ~{walkMinutes} min walk
                </div>
              </div>
            </div>
          </div>

          {/* Concise Walking Guidance Step */}
          {selectedDest.walkHint && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <span className="text-primary-600 font-bold shrink-0">🚶 Walk:</span>
              <span className="truncate flex-1 text-slate-600 dark:text-slate-300">{selectedDest.walkHint}</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                {walkingCue}
              </span>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
