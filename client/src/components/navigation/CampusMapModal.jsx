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
import { getLandmarkGuide } from "../../data/campusRoutes.js";

// Official GPREC Kurnool Campus Coordinates
export const GPREC_CAMPUS = {
  name: "G. Pulla Reddy Engineering College",
  shortName: "GPREC Campus",
  lat: 15.7747,
  lng: 78.0567,
  gateLat: 15.7760,
  gateLng: 78.0564,
  address: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, Andhra Pradesh 518007",
};

// 17 Categorized GPREC Campus Venues & Labs
export const CAMPUS_DESTINATIONS = [
  {
    id: "csm-labs",
    name: "CSM Labs & Hackathon Arena",
    shortName: "CSM Labs",
    department: "CSE (AI & ML)",
    category: "Labs & Hackathon",
    color: "#1a73e8",
    icon: "💻",
    lat: 15.7744,
    lng: 78.0572,
    floor: "2nd Floor (Intel Unnati Lab 6) & Ground/1st Fl",
    hours: "Open 24 Hours • CodeX 4.0 Venue",
    description: "8 dedicated AI & ML computer labs, 200+ Lenovo ThinkCentre Neo 50S workstations with 1 Gbps fiber internet.",
    landmarkCue: "Walk straight past Admin block, enter CSM front portico, take central stairs to 2nd Floor.",
    floorsDirectory: [
      { floor: "2nd Floor", labs: "Intel Unnati AI/ML Lab (CSM Lab 6) + Labs 7 & 8", equipment: "Intel AI Workstations (i5 12th Gen, 16GB RAM, NVMe)", specialFeature: "⭐ Primary CodeX 4.0 Hackathon Arena" },
      { floor: "1st Floor", labs: "CSM Labs 3, 4 & 5", equipment: "Database & Cloud CLI systems", specialFeature: "Multimedia Seminar & Tutorial Discussion Hall" },
      { floor: "Ground Floor", labs: "CSM Labs 1 & 2", equipment: "Python, C++, Java Programming systems", specialFeature: "Drone & Robotics Research Lab" },
    ],
  },
  {
    id: "csm-department",
    name: "CSM Department Office",
    shortName: "CSM Dept",
    department: "CSE (AI & ML)",
    category: "Academic Depts",
    color: "#0284c7",
    icon: "🤖",
    lat: 15.7745,
    lng: 78.0570,
    floor: "Ground Floor, CSM Block",
    hours: "8:30 AM – 5:30 PM",
    description: "HOD Chamber, faculty rooms, department library, student counseling cell, and Drone Research Lab.",
    landmarkCue: "Enter CSM Block main portico. HOD Office is directly on the right side of the ground floor corridor.",
  },
  {
    id: "food-court",
    name: "Campus Food Court",
    shortName: "Food Court",
    department: "Dining & Refreshments",
    category: "Food & Drinks",
    color: "#e37400",
    icon: "🍕",
    lat: 15.7733,
    lng: 78.0576,
    floor: "Central Amenities Plaza",
    hours: "9:00 AM – 7:00 PM",
    description: "Open-air student lifestyle hangout with shaded tables, pizzas, burgers, juices, shakes, and cold coffee.",
    landmarkCue: "Take eastern pathway past library toward Student Activity Plaza.",
  },
  {
    id: "cafeteria",
    name: "Main Cafeteria & Canteen",
    shortName: "Main Canteen",
    department: "Dining & Refreshments",
    category: "Food & Drinks",
    color: "#ea4335",
    icon: "🍽️",
    lat: 15.7738,
    lng: 78.0572,
    floor: "South-East Dining Block",
    hours: "8:30 AM – 5:30 PM",
    description: "Hot dosas, idli-sambar, poori, full meal thalis, snacks, and South Indian filter coffee.",
    landmarkCue: "Walk past library garden, take right near the shaded banyan tree toward the canteen entrance.",
  },
  {
    id: "auditorium",
    name: "Silver Jubilee Auditorium",
    shortName: "Auditorium",
    department: "Events & Keynotes",
    category: "Auditorium & Events",
    color: "#1a73e8",
    icon: "🏛️",
    lat: 15.7754,
    lng: 78.0558,
    floor: "Ground Level (1000+ AC Seating)",
    hours: "Event Venue",
    description: "Grand air-conditioned auditorium for CodeX opening keynote, speaker sessions, and valedictory awards.",
    landmarkCue: "80 meters from Main Gate, adjacent to Administrative Block left wing.",
  },
  {
    id: "amphitheatre",
    name: "Open Air Amphitheatre",
    shortName: "Amphitheatre",
    department: "Events & Cultural",
    category: "Auditorium & Events",
    color: "#a142f4",
    icon: "🎭",
    lat: 15.7743,
    lng: 78.0578,
    floor: "East Campus Quadrangle",
    hours: "Open 24/7",
    description: "Tiered semi-circular stone amphitheatre seating 800+ people for cultural events and evening mixers.",
    landmarkCue: "Stone-paved path east of central library garden.",
  },
  {
    id: "central-library",
    name: "Central Library & Digital Wing",
    shortName: "Central Library",
    department: "Library & Study",
    category: "Library & Study",
    color: "#0f9d58",
    icon: "📚",
    lat: 15.7748,
    lng: 78.0558,
    floor: "Ground & 1st Floor, West Wing",
    hours: "9:00 AM – 7:00 PM",
    description: "66,000+ volumes, IEEE digital access terminals, and quiet study zones.",
    landmarkCue: "Follow main central avenue 120m straight from gate. Double glass entrance.",
  },
  {
    id: "cse-block",
    name: "CSE Department Block",
    shortName: "CSE Block",
    department: "Computer Science",
    category: "Academic Depts",
    color: "#1a73e8",
    icon: "💻",
    lat: 15.7746,
    lng: 78.0565,
    floor: "Ground, 1st & 2nd Floors",
    hours: "8:30 AM – 5:30 PM",
    description: "Core Computer Science & Engineering department, faculty chambers, and programming labs.",
    landmarkCue: "Directly adjacent to Central Library on the main academic lane.",
  },
  {
    id: "admin-block",
    name: "Administrative Block",
    shortName: "Admin Block",
    department: "Administration",
    category: "Academic Depts",
    color: "#5f6368",
    icon: "🏛️",
    lat: 15.7756,
    lng: 78.0562,
    floor: "Ground & 1st Floor",
    hours: "9:00 AM – 5:00 PM",
    description: "Principal Office, Dean Academics, Accounts, Exam Section, and Registration Desks.",
    landmarkCue: "First large building on your left after entering the GPREC Main Gate.",
  },
  {
    id: "ece-eee-block",
    name: "ECE & EEE Department Block",
    shortName: "ECE / EEE Block",
    department: "Electronics & Electrical",
    category: "Academic Depts",
    color: "#d93025",
    icon: "⚡",
    lat: 15.7750,
    lng: 78.0574,
    floor: "Ground to 3rd Floor",
    hours: "8:30 AM – 5:30 PM",
    description: "Electronics, Embedded Systems, IoT Labs, VLSI design suites, and Electrical Machines labs.",
    landmarkCue: "North-east academic quadrangle opposite sports ground pathway.",
  },
  {
    id: "mech-civil-block",
    name: "Mechanical & Civil Block",
    shortName: "Mech & Civil Block",
    department: "Engineering",
    category: "Academic Depts",
    color: "#f29900",
    icon: "⚙️",
    lat: 15.7735,
    lng: 78.0560,
    floor: "Ground to 2nd Floor",
    hours: "8:30 AM – 5:30 PM",
    description: "CAD/CAM Simulation Labs, Robotics workshop, Thermal Engineering, and Structures Lab.",
    landmarkCue: "South-west quadrangle near the workshop road and parking zone.",
  },
  {
    id: "indoor-stadium",
    name: "Indoor Sports Stadium & Gym",
    shortName: "Indoor Stadium",
    department: "Recreation",
    category: "Hostels & Sports",
    color: "#188038",
    icon: "🏸",
    lat: 15.7730,
    lng: 78.0582,
    floor: "Ground Floor",
    hours: "6:00 AM – 8:00 PM",
    description: "Wooden badminton courts, table tennis arena, chess lounge, and student fitness gymnasium.",
    landmarkCue: "South-eastern corner of campus behind the food court plaza.",
  },
  {
    id: "sports-ground",
    name: "College Sports & Cricket Ground",
    shortName: "Sports Ground",
    department: "Athletics",
    category: "Hostels & Sports",
    color: "#1e8e3e",
    icon: "🏏",
    lat: 15.7758,
    lng: 78.0585,
    floor: "Open Ground",
    hours: "Open daily",
    description: "Cricket pitch, 400m running track, football field, volleyball, and basketball floodlit courts.",
    landmarkCue: "Eastern perimeter of campus, accessible past the ECE block.",
  },
  {
    id: "boys-hostel",
    name: "GPREC Boys Hostel Block",
    shortName: "Boys Hostel",
    department: "Residential",
    category: "Hostels & Sports",
    color: "#1967d2",
    icon: "🏢",
    lat: 15.7725,
    lng: 78.0568,
    floor: "Hostel Blocks A, B & C",
    hours: "Resident Access 24/7",
    description: "Resident rooms, dining mess, study rooms, and high-speed Wi-Fi facilities.",
    landmarkCue: "Southern edge of campus past the cafeteria and workshop zone.",
  },
  {
    id: "girls-hostel",
    name: "GPREC Girls Hostel Complex",
    shortName: "Girls Hostel",
    department: "Residential",
    category: "Hostels & Sports",
    color: "#d01884",
    icon: "🏡",
    lat: 15.7728,
    lng: 78.0552,
    floor: "Gated Residential Complex",
    hours: "Resident Access",
    description: "Secure gated hostel with dining hall, recreational lounge, and medical support.",
    landmarkCue: "South-western campus boundary with dedicated security gate.",
  },
  {
    id: "atm-health",
    name: "Canara Bank ATM & Health Centre",
    shortName: "ATM & Dispensary",
    department: "Amenities",
    category: "Hostels & Sports",
    color: "#f9ab00",
    icon: "🏥",
    lat: 15.7758,
    lng: 78.0560,
    floor: "Ground Floor (Near Main Gate)",
    hours: "ATM 24/7 • Health 9:00 AM – 5:00 PM",
    description: "24/7 cash dispenser and campus medical dispensary with resident medical officer.",
    landmarkCue: "Immediately inside the Main Gate on the right side.",
  },
  {
    id: "main-gate",
    name: "GPREC Main Gate & Security",
    shortName: "Main Gate",
    department: "Entrance",
    category: "Hostels & Sports",
    color: "#202124",
    icon: "🚪",
    lat: 15.7760,
    lng: 78.0564,
    floor: "Campus Security Arch",
    hours: "24/7 Gate",
    description: "Main campus entrance on Nandyal Road, security checkpoint, and visitor parking.",
    landmarkCue: "Main entrance arch facing Nandyal Road.",
  },
];

// Group destinations into clean categories for the dropdown selector
const CATEGORIES = [
  "Labs & Hackathon",
  "Dining & Refreshments",
  "Auditorium & Events",
  "Library & Study",
  "Academic Depts",
  "Hostels & Sports",
];

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
  // Selected Destination
  const [selectedDest, setSelectedDest] = useState(
    CAMPUS_DESTINATIONS.find((d) => d.id === initialDestinationId) || CAMPUS_DESTINATIONS[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFloorDetails, setShowFloorDetails] = useState(false);
  const [selectedFloorTab, setSelectedFloorTab] = useState("2nd Floor");

  // User Live GPS Coordinates
  const [userLocation, setUserLocation] = useState({
    lat: GPREC_CAMPUS.gateLat,
    lng: GPREC_CAMPUS.gateLng,
    isReal: false,
    accuracy: 10,
  });

  // Origin mode: "gps" | "gate"
  const [originMode, setOriginMode] = useState("gate");
  const [gpsStatus, setGpsStatus] = useState("idle"); // "idle" | "requesting" | "active" | "denied"

  // Route Polyline
  const [routePoints, setRoutePoints] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);

  // Compass Hook
  const compass = useCompass();

  // Map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const watchIdRef = useRef(null);

  // Active start point
  const activeStartPoint = useMemo(() => {
    if (originMode === "gps" && userLocation.isReal) {
      return {
        lat: userLocation.lat,
        lng: userLocation.lng,
        label: "Your Live Location",
      };
    }
    return {
      lat: GPREC_CAMPUS.gateLat,
      lng: GPREC_CAMPUS.gateLng,
      label: "GPREC Main Gate",
    };
  }, [originMode, userLocation]);

  // Sync initial destination
  useEffect(() => {
    if (initialDestinationId) {
      const match = CAMPUS_DESTINATIONS.find((d) => d.id === initialDestinationId);
      if (match) setSelectedDest(match);
    }
  }, [initialDestinationId]);

  // Request GPS
  const requestLiveGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }
    setGpsStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isReal: true,
          accuracy: Math.round(pos.coords.accuracy || 8),
        };
        setUserLocation(coords);
        setOriginMode("gps");
        setGpsStatus("active");
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 18, { duration: 0.8 });
        }
      },
      () => {
        setGpsStatus("denied");
        setOriginMode("gate");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
  };

  // Continuous GPS watch
  useEffect(() => {
    if (!isOpen || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isReal: true,
          accuracy: Math.round(pos.coords.accuracy || 8),
        };
        setUserLocation(coords);
        setGpsStatus("active");
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isOpen]);

  // Fetch walking route via OSRM
  useEffect(() => {
    if (!isOpen || !selectedDest) return;

    let cancelled = false;
    setRouteLoading(true);

    const startLat = activeStartPoint.lat;
    const startLng = activeStartPoint.lng;
    const endLat = selectedDest.lat;
    const endLng = selectedDest.lng;

    const url = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
          const latLngs = data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          setRoutePoints(latLngs);
        } else {
          // Straight line fallback
          setRoutePoints([
            [startLat, startLng],
            [endLat, endLng],
          ]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRoutePoints([
            [startLat, startLng],
            [endLat, endLng],
          ]);
        }
      })
      .finally(() => {
        if (!cancelled) setRouteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, selectedDest, activeStartPoint]);

  // Initialize and update Leaflet Map
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

    // Clean Google Roadmap vector tiles
    const tileLayer = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom control on bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // User pulsating blue marker
    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div class="relative flex items-center justify-center w-7 h-7">
          <span class="absolute w-7 h-7 rounded-full bg-blue-500/30 animate-ping"></span>
          <span class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    userMarkerRef.current = L.marker([activeStartPoint.lat, activeStartPoint.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Destination Red Pin
    const destIcon = L.divIcon({
      className: "custom-dest-pin",
      html: `
        <div class="flex flex-col items-center">
          <div class="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5 border border-slate-700">
            ${selectedDest.shortName || selectedDest.name}
          </div>
          <div class="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-xs">
            ${selectedDest.icon}
          </div>
        </div>
      `,
      iconSize: [32, 48],
      iconAnchor: [16, 44],
    });

    destMarkerRef.current = L.marker([selectedDest.lat, selectedDest.lng], {
      icon: destIcon,
      zIndexOffset: 900,
    }).addTo(map);

    // Walking Polyline
    routeLineRef.current = L.polyline([], {
      color: "#1a73e8",
      weight: 5,
      opacity: 0.9,
      lineCap: "round",
      dashArray: "8, 8",
    }).addTo(map);

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
      fitRoute();
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

  // Update map polyline and markers when destination or start point changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([activeStartPoint.lat, activeStartPoint.lng]);
    }

    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([selectedDest.lat, selectedDest.lng]);
      const newIcon = L.divIcon({
        className: "custom-dest-pin",
        html: `
          <div class="flex flex-col items-center">
            <div class="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5 border border-slate-700">
              ${selectedDest.shortName || selectedDest.name}
            </div>
            <div class="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-xs">
              ${selectedDest.icon}
            </div>
          </div>
        `,
        iconSize: [32, 48],
        iconAnchor: [16, 44],
      });
      destMarkerRef.current.setIcon(newIcon);
    }

    if (routeLineRef.current && routePoints.length >= 2) {
      routeLineRef.current.setLatLngs(routePoints);
      fitRoute();
    }
  }, [selectedDest, activeStartPoint, routePoints]);

  const fitRoute = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([
      [activeStartPoint.lat, activeStartPoint.lng],
      [selectedDest.lat, selectedDest.lng],
    ]);
    mapInstanceRef.current.fitBounds(bounds, {
      paddingTopLeft: [40, 70],
      paddingBottomRight: [40, 180],
      maxZoom: 18,
    });
  };

  const recenter = () => {
    if (!mapInstanceRef.current) return;
    if (originMode === "gps" && userLocation.isReal) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 18, { duration: 0.6 });
    } else {
      fitRoute();
    }
  };

  if (!isOpen) return null;

  // Live Distance & Walking calculations
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

  const landmarkGuide = getLandmarkGuide(selectedDest.id, selectedDest.name);
  const primaryLandmarkStep =
    selectedDest.landmarkCue || landmarkGuide.walkingSteps?.[0]?.instruction;

  const filteredPlaces = CAMPUS_DESTINATIONS.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.department?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q) ||
      d.floor?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[100dvh] sm:h-[92vh] sm:rounded-3xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col z-10 shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800">
        {/* ========================================================= */}
        {/* 1. TOP MINIMAL CONTROL BAR (Linear, 1-Row, Clean)          */}
        {/* ========================================================= */}
        <header className="relative z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 shadow-sm">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            aria-label="Close Map"
          >
            ✕
          </button>

          {/* Central Linear Location Dropdown Trigger */}
          <div className="relative flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-primary-500 text-left transition shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{selectedDest.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedDest.name}
                  </div>
                  <div className="text-[10px] text-primary-600 dark:text-primary-400 font-medium truncate">
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

            {/* Linear Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-80 overflow-y-auto p-2 scrollbar-thin"
                >
                  {/* Filter Search Input */}
                  <div className="mb-2 px-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search lab, food, auditorium, library..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  {/* Categorized Places List */}
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
                            <span className="text-lg shrink-0">{place.icon}</span>
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-bold truncate ${
                                  isSelected ? "text-primary-600 dark:text-primary-400" : "text-slate-800 dark:text-slate-100"
                                }`}
                              >
                                {place.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {place.floor}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            {place.category}
                          </span>
                        </button>
                      );
                    })}
                    {filteredPlaces.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-4">No places matching "{searchQuery}"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: GPS Origin Toggle & Recenter */}
          <div className="flex items-center gap-1.5 shrink-0">
            {userLocation.isReal ? (
              <button
                type="button"
                onClick={() => setOriginMode(originMode === "gps" ? "gate" : "gps")}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer ${
                  originMode === "gps"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                title="Toggle GPS vs Main Gate start point"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="hidden sm:inline">{originMode === "gps" ? "My GPS" : "Gate"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={requestLiveGPS}
                className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-primary-600 dark:text-primary-400 border border-blue-200 dark:border-blue-800 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                title="Detect live GPS"
              >
                <span>📍</span>
                <span className="hidden sm:inline">{gpsStatus === "requesting" ? "Locating..." : "Turn On GPS"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={recenter}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary-600 flex items-center justify-center transition cursor-pointer"
              title="Re-center route"
            >
              🎯
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. MAIN MAP CANVAS (Uncluttered, Full View)                */}
        {/* ========================================================= */}
        <div className="relative flex-1 w-full h-full bg-[#f2efe9]">
          <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#f2efe9]" />

          {/* Quick Compass Facing Sensor (Collapsible) */}
          {compass.permissionState === "prompt" && (
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={compass.requestPermission}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 animate-pulse cursor-pointer"
              >
                <span>📡</span>
                <span>Enable Compass</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. SINGLE UNIFIED LINEAR BOTTOM CARD (Integrated Compass) */}
        {/* ========================================================= */}
        <div className="relative z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex flex-col gap-2 shrink-0 shadow-lg">
          {/* Row 1: Venue Title, Floor & Rotating Direction Compass */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl p-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 shrink-0">
                {selectedDest.icon}
              </span>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {selectedDest.name}
                </h3>
                <p className="text-[11px] text-primary-600 dark:text-primary-400 font-semibold truncate">
                  📍 {selectedDest.floor}
                </p>
              </div>
            </div>

            {/* Integrated Live Compass Indicator & Distance Badge */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              {/* Rotating arrow pointer */}
              <div
                className="w-5 h-5 flex items-center justify-center transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${relativeAngle}deg)` }}
                title={`Target Bearing: ${Math.round(targetBearing)}°`}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[12px] border-b-emerald-500" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-none font-mono">
                  {formattedDistance}
                </div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  ~{walkMinutes} min walk
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: 1-Line Walking Cue & Landmark Guide */}
          {primaryLandmarkStep && (
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <span className="text-primary-600 font-bold shrink-0">🚶 Walk:</span>
              <span className="truncate flex-1">{primaryLandmarkStep}</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {walkingCue}
              </span>
            </div>
          )}

          {/* Row 3: Optional Floor Details Accordion Toggle (for Labs & Workstations) */}
          {selectedDest.floorsDirectory && selectedDest.floorsDirectory.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowFloorDetails(!showFloorDetails)}
                className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>🏢 {showFloorDetails ? "Hide Floor Directory ▲" : "View Floor & Lab Directory ▼"}</span>
              </button>

              <AnimatePresence>
                {showFloorDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    {/* Floor Tabs */}
                    <div className="flex items-center gap-1">
                      {selectedDest.floorsDirectory.map((f) => (
                        <button
                          key={f.floor}
                          type="button"
                          onClick={() => setSelectedFloorTab(f.floor)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            selectedFloorTab === f.floor
                              ? "bg-primary-600 text-white shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {f.floor}
                        </button>
                      ))}
                    </div>

                    {/* Active Floor Content */}
                    {(() => {
                      const active =
                        selectedDest.floorsDirectory.find((f) => f.floor === selectedFloorTab) ||
                        selectedDest.floorsDirectory[0];
                      return (
                        <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-200">
                          <div className="font-bold text-primary-600 dark:text-primary-400">{active.labs}</div>
                          <div className="text-slate-500 dark:text-slate-400">
                            <strong>Equipment:</strong> {active.equipment}
                          </div>
                          {active.specialFeature && (
                            <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {active.specialFeature}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
