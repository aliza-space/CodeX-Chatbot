import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Official GPREC Kurnool Campus Location
export const GPREC_CAMPUS = {
  name: "G. Pulla Reddy Engineering College",
  shortName: "GPREC Campus",
  lat: 15.7747,
  lng: 78.0567,
  gateLat: 15.7760,
  gateLng: 78.0564,
  address: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, Andhra Pradesh 518007",
};

// 17 Comprehensive GPREC Spots including verified CSM Department & CSM Labs from gprec.ac.in
export const CAMPUS_DESTINATIONS = [
  {
    id: "csm-labs",
    name: "CSM Computer Labs (Labs 1 – 8)",
    shortName: "CSM Labs",
    tagline: "CodeX 4.0 Hackathon Hub & Intel Unnati Lab",
    category: "Hackathon Hub",
    color: "#1a73e8",
    icon: "💻",
    lat: 15.7744,
    lng: 78.0572,
    rating: "4.9",
    reviewsCount: 156,
    floor: "Ground, 1st & 2nd Floors, CSM Block",
    hours: "Open 24 Hours • CodeX 4.0 Event Venue",
    description:
      "Dedicated computer laboratory complex for CSE (AI & ML). Houses 8 specialized labs, 200+ Lenovo ThinkCentre Neo 50S workstations, 1 Gbps fiber internet, and online UPS backup.",
    floorsDirectory: [
      {
        floor: "Ground Floor",
        labs: "CSM Lab 1 & CSM Lab 2",
        equipment: "Lenovo ThinkCentre Neo 50S (i5 12th Gen, 16GB RAM, 512GB SSD)",
        subjects: "Python, C, C++, Java Programming, OOPs & Data Structures",
        specialFeature: "Drone & Robotics Research Lab (UAV hardware prototyping)",
      },
      {
        floor: "1st Floor",
        labs: "CSM Lab 3, CSM Lab 4 & CSM Lab 5",
        equipment: "High-speed workstations with Oracle, PostgreSQL & Cloud CLI",
        subjects: "Database Management Systems (DBMS), Web Technologies, Cloud Computing",
        specialFeature: "Multimedia Seminar & Tutorial Discussion Hall",
      },
      {
        floor: "2nd Floor",
        labs: "Intel Unnati AI/ML Lab (CSM Lab 6) + CSM Lab 7 & 8",
        equipment: "Intel-sponsored AI workstations (i5 12th Gen, 16GB RAM, NVMe SSD, Win 11)",
        subjects: "Deep Learning, Natural Language Processing (NLP), Computer Vision, Generative AI",
        specialFeature: "⭐ Primary CodeX 4.0 Hackathon Arena & Incubation Center",
      },
    ],
    distanceFromGateMeters: 170,
    walkTimeMins: 2,
  },
  {
    id: "csm-department",
    name: "CSM Department (CSE - AI & ML)",
    shortName: "CSM Department",
    tagline: "HOD Office, Faculty Chambers & Drone Lab",
    category: "Academic",
    color: "#0284c7",
    icon: "🤖",
    lat: 15.7745,
    lng: 78.0570,
    rating: "4.8",
    reviewsCount: 92,
    floor: "Ground Floor, CSM Block",
    hours: "Open • 8:30 AM – 5:30 PM",
    description:
      "Department of Computer Science and Engineering (Artificial Intelligence & Machine Learning). Contains HOD Chamber, faculty rooms, department library, student counseling cell, and Drone Research Lab.",
    floorsDirectory: [
      {
        floor: "Ground Floor",
        labs: "CSM Department Office & HOD Chamber",
        equipment: "Faculty Chambers, Student Records, Department Library",
        subjects: "AI & ML Academic Curriculum, Project Approvals & Mentorship",
        specialFeature: "Drone & Robotics Prototyping Research Lab",
      },
    ],
    distanceFromGateMeters: 170,
    walkTimeMins: 2,
  },
  {
    id: "food-court",
    name: "Campus Food Court",
    shortName: "Food Court",
    tagline: "Pizzas, Mocktails, Juices & Shakes",
    category: "Food & Drinks",
    color: "#e37400",
    icon: "🍕",
    lat: 15.7733,
    lng: 78.0576,
    rating: "4.8",
    reviewsCount: 230,
    floor: "Central Amenities Plaza",
    hours: "Open now • 9:00 AM – 7:00 PM",
    description:
      "Open-air student lifestyle hangout with shaded tables, wood-fired pizzas, burgers, rolls, cold coffees, thick milkshakes, and ice creams.",
    distanceFromGateMeters: 260,
    walkTimeMins: 3,
  },
  {
    id: "cafeteria",
    name: "Main Cafeteria & Canteen",
    shortName: "Cafeteria",
    tagline: "South Indian Breakfast & Hot Meals",
    category: "Dining",
    color: "#ea4335",
    icon: "🍽️",
    lat: 15.7738,
    lng: 78.0572,
    rating: "4.7",
    reviewsCount: 310,
    floor: "South-East Dining Block",
    hours: "Open now • 8:30 AM – 5:30 PM",
    description:
      "Official college canteen overseen by student Canteen Committee. Hot dosas, idli-sambar, poori, meal thalis, and filter coffee.",
    distanceFromGateMeters: 230,
    walkTimeMins: 3,
  },
  {
    id: "central-library",
    name: "Central Library",
    shortName: "Central Library",
    tagline: "66K+ Volumes, SLIM 21 & Digital Wing",
    category: "Library & Study",
    color: "#0f9d58",
    icon: "📚",
    lat: 15.7748,
    lng: 78.0558,
    rating: "4.9",
    reviewsCount: 180,
    floor: "Central Academic Block, West Wing",
    hours: "Open now • 9:00 AM – 7:00 PM",
    description:
      "Over 66,106 volumes, 14,153 titles, fully automated SLIM 21 barcode system, and a 12-terminal digital wing with IEEE and ScienceDirect.",
    distanceFromGateMeters: 120,
    walkTimeMins: 1.5,
  },
  {
    id: "amphitheatre",
    name: "Open Air Amphitheatre",
    shortName: "Amphitheatre",
    tagline: "Cultural Arena & Tiered Stone Seating",
    category: "Gathering Hub",
    color: "#a142f4",
    icon: "🎭",
    lat: 15.7743,
    lng: 78.0578,
    rating: "4.9",
    reviewsCount: 165,
    floor: "East Campus Quadrangle",
    hours: "Open 24/7",
    description:
      "Tiered semi-circular stone amphitheatre seating 800+ people for cultural fests, music performances, and CodeX evening mixers.",
    distanceFromGateMeters: 190,
    walkTimeMins: 2.5,
  },
  {
    id: "auditorium",
    name: "Silver Jubilee Auditorium",
    shortName: "Auditorium",
    tagline: "1000+ AC Central Keynote Hall",
    category: "Auditorium",
    color: "#1a73e8",
    icon: "🏛️",
    lat: 15.7754,
    lng: 78.0558,
    rating: "4.9",
    reviewsCount: 95,
    floor: "Entrance Complex, West Side",
    hours: "Open during scheduled event sessions",
    description:
      "Air-conditioned 1,000+ capacity auditorium with Bose professional line-array sound for CodeX 4.0 inaugural and guest talks.",
    distanceFromGateMeters: 70,
    walkTimeMins: 1,
  },
  {
    id: "cse-block",
    name: "CSE & CST Academic Block",
    shortName: "CSE Block",
    tagline: "Computer Science Dept & Faculty Labs",
    category: "Academic",
    color: "#1a73e8",
    icon: "🖥️",
    lat: 15.7749,
    lng: 78.0571,
    rating: "4.8",
    reviewsCount: 88,
    floor: "3-Storey CSE Academic Complex",
    hours: "Open • 8:30 AM – 6:00 PM",
    description:
      "Primary Computer Science department block housing faculty chambers, AI/ML research labs, and main campus server room.",
    distanceFromGateMeters: 140,
    walkTimeMins: 2,
  },
  {
    id: "admin-block",
    name: "Administrative Block",
    shortName: "Admin Block",
    tagline: "Principal Office, Dean & Exam Cell",
    category: "Academic",
    color: "#d93025",
    icon: "🏢",
    lat: 15.7751,
    lng: 78.0564,
    rating: "4.6",
    reviewsCount: 52,
    floor: "Central Admin Complex",
    hours: "Open • 9:00 AM – 5:00 PM",
    description:
      "Principal's office, Dean of Academics, Autonomous Examination Section, Accounts department, and student administration.",
    distanceFromGateMeters: 90,
    walkTimeMins: 1,
  },
  {
    id: "ece-eee-block",
    name: "ECE & EEE Department Block",
    shortName: "ECE Block",
    tagline: "Electronics, IoT & Hardware Labs",
    category: "Academic",
    color: "#0f9d58",
    icon: "📡",
    lat: 15.7741,
    lng: 78.0564,
    rating: "4.7",
    reviewsCount: 64,
    floor: "South Academic Wing",
    hours: "Open • 8:30 AM – 5:30 PM",
    description:
      "Electronics & Communication and Electrical Engineering departments with modern robotics, VLSI, and hardware labs.",
    distanceFromGateMeters: 210,
    walkTimeMins: 2.5,
  },
  {
    id: "mech-civil-block",
    name: "Mechanical & Civil Workshops",
    shortName: "Mech Workshops",
    tagline: "Workshops, CAD Labs & Foundry",
    category: "Academic",
    color: "#5f6368",
    icon: "⚙️",
    lat: 15.7735,
    lng: 78.0560,
    rating: "4.6",
    reviewsCount: 47,
    floor: "South-West Workshop Sheds",
    hours: "Open • 9:00 AM – 5:00 PM",
    description:
      "High-bay mechanical engineering workshops, machine tools, heat transfer labs, and civil surveying equipment stores.",
    distanceFromGateMeters: 270,
    walkTimeMins: 3.5,
  },
  {
    id: "indoor-stadium",
    name: "Indoor Sports Stadium & Gym",
    shortName: "Indoor Stadium",
    tagline: "Wooden Badminton Courts & Fitness Gym",
    category: "Sports",
    color: "#129eaf",
    icon: "🏸",
    lat: 15.7748,
    lng: 78.0583,
    rating: "4.9",
    reviewsCount: 110,
    floor: "East Campus Sports Complex",
    hours: "Open • 6:00 AM – 8:30 PM",
    description:
      "Three wooden badminton courts, table tennis hall, multi-station fitness gym, and sports coordinator office.",
    distanceFromGateMeters: 220,
    walkTimeMins: 3,
  },
  {
    id: "sports-ground",
    name: "College Cricket & Athletics Ground",
    shortName: "Sports Ground",
    tagline: "Full-size Cricket & Football Oval",
    category: "Sports",
    color: "#0f9d58",
    icon: "🏏",
    lat: 15.7754,
    lng: 78.0592,
    rating: "4.8",
    reviewsCount: 175,
    floor: "East Perimeter Grounds",
    hours: "Open • 6:00 AM – 7:00 PM",
    description:
      "Standard 400m running track, turf cricket pitch, basketball courts, and volleyball courts.",
    distanceFromGateMeters: 280,
    walkTimeMins: 3.5,
  },
  {
    id: "girls-hostel",
    name: "Girls Hostel",
    shortName: "Girls Hostel",
    tagline: "Secure Residential Quarters",
    category: "Hostels",
    color: "#e52592",
    icon: "🏨",
    lat: 15.7742,
    lng: 78.0548,
    rating: "4.7",
    reviewsCount: 92,
    floor: "West Campus Residential Zone",
    hours: "Gated 24/7 Security",
    description:
      "Gated female residential complex with biometric entry, 24/7 warden, CCTV surveillance, and dining hall.",
    distanceFromGateMeters: 210,
    walkTimeMins: 2.5,
  },
  {
    id: "boys-hostel",
    name: "Boys Hostel & Dining Mess",
    shortName: "Boys Hostel",
    tagline: "Campus Residential Blocks",
    category: "Hostels",
    color: "#1a73e8",
    icon: "🏢",
    lat: 15.7726,
    lng: 78.0568,
    rating: "4.6",
    reviewsCount: 140,
    floor: "South Residential Zone",
    hours: "Gated 24/7 Security",
    description:
      "Four-block residential hostel complex for male students with integrated dining mess, RO water plant, and recreation room.",
    distanceFromGateMeters: 360,
    walkTimeMins: 4.5,
  },
  {
    id: "main-gate",
    name: "Main Entrance Gate",
    shortName: "Main Gate",
    tagline: "Nandyal Road Security Checkpoint",
    category: "Campus Entry",
    color: "#1a73e8",
    icon: "🚗",
    lat: 15.7760,
    lng: 78.0564,
    rating: "4.8",
    reviewsCount: 215,
    floor: "Campus Perimeter",
    hours: "Open 24/7 • Security Checkpoint",
    description:
      "Primary vehicle boom barrier, visitor registration booth, and CodeX 4.0 welcome reception desk on Nandyal Road.",
    distanceFromGateMeters: 0,
    walkTimeMins: 0,
  },
  {
    id: "atm-health",
    name: "Canara Bank ATM & Health Dispensary",
    shortName: "ATM & Clinic",
    tagline: "24/7 Cash ATM & Medical First Aid",
    category: "Amenities",
    color: "#129eaf",
    icon: "🏧",
    lat: 15.7758,
    lng: 78.0567,
    rating: "4.7",
    reviewsCount: 78,
    floor: "Entrance Annex Building",
    hours: "ATM: 24/7 • Health: 9:00 AM – 6:00 PM",
    description:
      "Canara Bank cash dispenser and medical dispensary staffed with resident medical officer and first-aid kits.",
    distanceFromGateMeters: 30,
    walkTimeMins: 0.5,
  },
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
  // Destination State
  const [selectedDest, setSelectedDest] = useState(
    CAMPUS_DESTINATIONS.find((d) => d.id === initialDestinationId) || CAMPUS_DESTINATIONS[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlacesDrawer, setShowPlacesDrawer] = useState(false);
  const [selectedFloorTab, setSelectedFloorTab] = useState("2nd Floor"); // Default to 2nd Floor (Hackathon Hub)

  // Active Map Layer: "roadmap" (Google Road) | "satellite" (Google Hybrid) | "terrain" (Google Terrain) | "osm" (OpenStreetMap)
  const [mapLayerType, setMapLayerType] = useState("roadmap");
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Travel Mode: "drive" | "bike" | "walk"
  const [travelMode, setTravelMode] = useState("walk");

  // User's Real Live Location
  const [userLocation, setUserLocation] = useState({
    lat: 15.7760,
    lng: 78.0564,
    isReal: false,
  });

  // GPS Status: "idle" | "requesting" | "active" | "denied"
  const [gpsStatus, setGpsStatus] = useState("idle");

  // Origin: "gps" (User's location) or "gate" (GPREC Main Gate)
  const [originMode, setOriginMode] = useState("gate");

  // Route points & statistics
  const [routeData, setRouteData] = useState({
    points: [],
    distanceMeters: 0,
    durationSeconds: 0,
    loading: false,
  });

  // Navigation mode
  const [isNavigating, setIsNavigating] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  // Map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const routeGlowRef = useRef(null);
  const watchIdRef = useRef(null);
  const navIntervalRef = useRef(null);

  // Sync initialDestinationId
  useEffect(() => {
    if (initialDestinationId) {
      const match = CAMPUS_DESTINATIONS.find((d) => d.id === initialDestinationId);
      if (match) setSelectedDest(match);
    }
  }, [initialDestinationId]);

  // Voice narration helper using Web Speech API
  const speakInstruction = (text) => {
    if (voiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis errors
    }
  };

  // 100% Authentic Google Maps & Clean OSM Tile URLs (Zero Watermarks)
  const TILE_URLS = {
    roadmap: "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    satellite: "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    terrain: "https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  // Request & track user's real live GPS location
  const requestLiveLocation = () => {
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
          accuracy: Math.round(pos.coords.accuracy || 10),
        };
        setUserLocation(coords);
        setOriginMode("gps");
        setGpsStatus("active");

        const dist = calculateDistanceMeters(coords.lat, coords.lng, GPREC_CAMPUS.lat, GPREC_CAMPUS.lng);
        if (dist < 800) {
          setTravelMode("walk");
        } else if (dist < 4000) {
          setTravelMode("bike");
        } else {
          setTravelMode("drive");
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 17, { duration: 0.8 });
        }
        speakInstruction("GPS location detected. Centering on your location.");
      },
      (err) => {
        console.warn("GPS detection error:", err.message);
        setGpsStatus("denied");
        setOriginMode("gate");
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
    );
  };

  // 1. Request user's LIVE GPS Location on mount & watch movement
  useEffect(() => {
    if (!isOpen) return;

    requestLiveLocation();

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            isReal: true,
            accuracy: Math.round(pos.coords.accuracy || 10),
          });
          setGpsStatus("active");
        },
        null,
        { enableHighAccuracy: true, maximumAge: 3000 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isOpen]);

  // Active starting coordinate
  const activeStartPoint = useMemo(() => {
    if (originMode === "gate" || !userLocation.isReal) {
      return { lat: GPREC_CAMPUS.gateLat, lng: GPREC_CAMPUS.gateLng, label: "GPREC Main Gate" };
    }
    return {
      lat: userLocation.lat,
      lng: userLocation.lng,
      label: "Your Live GPS Location",
    };
  }, [originMode, userLocation]);

  // 2. Fetch Real Road Geometry via OSRM with realistic speed calculations
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchRoute = async () => {
      setRouteData((prev) => ({ ...prev, loading: true }));
      const start = activeStartPoint;
      const dest = selectedDest;

      const osrmProfile = travelMode === "walk" ? "walking" : "driving";
      const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok" && data.routes?.[0] && isMounted) {
          const route = data.routes[0];
          const latLngs = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          const distMeters = Math.round(route.distance);

          // Realistic travel durations
          let durationSecs;
          if (travelMode === "walk") {
            durationSecs = Math.round(distMeters / 1.25); // ~4.5 km/h
          } else if (travelMode === "bike") {
            durationSecs = Math.round(distMeters / 9.5); // ~34 km/h
          } else {
            durationSecs = Math.round(distMeters / 8.3); // ~30 km/h city driving
          }

          setRouteData({
            points: latLngs,
            distanceMeters: distMeters,
            durationSeconds: durationSecs,
            loading: false,
          });
        } else {
          throw new Error("OSRM fallback");
        }
      } catch {
        if (!isMounted) return;
        const dist = calculateDistanceMeters(start.lat, start.lng, dest.lat, dest.lng);
        let durationSecs;
        if (travelMode === "walk") {
          durationSecs = Math.round(dist / 1.25);
        } else if (travelMode === "bike") {
          durationSecs = Math.round(dist / 9.5);
        } else {
          durationSecs = Math.round(dist / 8.3);
        }

        setRouteData({
          points: [
            [start.lat, start.lng],
            [GPREC_CAMPUS.gateLat, GPREC_CAMPUS.gateLng],
            [15.7750, 78.0564],
            [dest.lat, dest.lng],
          ],
          distanceMeters: dist,
          durationSeconds: durationSecs,
          loading: false,
        });
      }
    };

    const timer = setTimeout(fetchRoute, 80);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, activeStartPoint, selectedDest, travelMode]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Clean up any stale map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn("Map removal:", e);
      }
      mapInstanceRef.current = null;
    }

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }
    mapContainerRef.current.innerHTML = "";

    const map = L.map(mapContainerRef.current, {
      center: [selectedDest.lat, selectedDest.lng],
      zoom: 17,
      maxZoom: 20,
      minZoom: 12,
      zoomControl: false,
    });

    // Helper to get correct subdomains for each tile provider
    const getSubdomainsForLayer = (layerKey) => {
      if (layerKey === "osm") return ["a", "b", "c"];
      return ["0", "1", "2", "3"];
    };

    // Primary Tile Layer with clean OSM fallback on error (Zero watermarks!)
    const createTiles = (layerKey) => {
      const url = TILE_URLS[layerKey] || TILE_URLS.roadmap;
      const subdomains = getSubdomainsForLayer(layerKey);
      const layer = L.tileLayer(url, {
        attribution: '&copy; Google Maps & OpenStreetMap',
        maxZoom: 20,
        subdomains,
      });

      layer.on("tileerror", () => {
        if (layerKey !== "osm" && mapInstanceRef.current) {
          console.warn("Tile error on", layerKey, "falling back to OpenStreetMap");
          try {
            map.removeLayer(layer);
          } catch (e) {
            // ignore
          }
          const osmLayer = L.tileLayer(TILE_URLS.osm, {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
            subdomains: ["a", "b", "c"],
          }).addTo(map);
          tileLayerRef.current = osmLayer;
        }
      });

      return layer;
    };

    const tileLayer = createTiles(mapLayerType).addTo(map);
    tileLayerRef.current = tileLayer;

    // Add all Campus Spots as Google Pins
    CAMPUS_DESTINATIONS.forEach((dest) => {
      const isSelected = dest.id === selectedDest.id;
      const icon = createGooglePinIcon(dest, isSelected);

      const marker = L.marker([dest.lat, dest.lng], {
        icon,
        zIndexOffset: isSelected ? 800 : 100,
      }).addTo(map);

      marker.on("click", () => {
        handleSelectDestination(dest);
      });

      marker.bindTooltip(dest.name, {
        direction: "top",
        offset: [0, -22],
        className: "custom-map-tooltip",
      });

      markersRef.current[dest.id] = marker;
    });

    // Google Blue Dot User Marker
    const userIcon = L.divIcon({
      className: "custom-google-user",
      html: `<div class="google-user-dot-container">
        <div class="google-user-halo"></div>
        <div class="google-heading-cone"></div>
        <div class="google-user-dot"></div>
      </div>`,
      iconSize: [0, 0],
    });

    userMarkerRef.current = L.marker([activeStartPoint.lat, activeStartPoint.lng], {
      icon: userIcon,
      zIndexOffset: 1200,
    }).addTo(map);

    // Route Polyline (Google Maps Blue)
    routeGlowRef.current = L.polyline([], {
      color: "#1a73e8",
      weight: 9,
      opacity: 0.22,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    routeLineRef.current = L.polyline([], {
      color: "#1a73e8",
      weight: 5,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    mapInstanceRef.current = map;

    const timer1 = setTimeout(() => {
      map.invalidateSize();
      fitRouteOnScreen();
    }, 120);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 450);

    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", handleResize);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
      markersRef.current = {};
      userMarkerRef.current = null;
      routeGlowRef.current = null;
      routeLineRef.current = null;
    };
  }, [isOpen]);

  // Handle direct destination selection (immediately updates map, card, floor tabs, and route!)
  const handleSelectDestination = (dest) => {
    stopNavigation();
    setSelectedDest(dest);
    setShowPlacesDrawer(false);
    setSearchQuery("");

    if (dest.floorsDirectory && dest.floorsDirectory.length > 0) {
      if (dest.id === "csm-labs") {
        setSelectedFloorTab("2nd Floor");
      } else {
        setSelectedFloorTab(dest.floorsDirectory[0].floor);
      }
    }

    // Immediately fit the route so the user sees their location + the new destination
    fitRouteOnScreen(dest);
    speakInstruction(`Selected ${dest.name}.`);
  };

  // Fit route smoothly on screen so user, destination pin, and road line are in full view
  const fitRouteOnScreen = (overrideDest = null) => {
    if (!mapInstanceRef.current) return;
    const dest = overrideDest || selectedDest;
    const points =
      routeData.points && routeData.points.length >= 2
        ? routeData.points
        : [
            [activeStartPoint.lat, activeStartPoint.lng],
            [dest.lat, dest.lng],
          ];

    try {
      const bounds = L.latLngBounds(points);
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [70, 70],
        paddingBottomRight: [70, 260],
        maxZoom: 18,
      });
    } catch {
      mapInstanceRef.current.setView([dest.lat, dest.lng], 17);
    }
  };

  // 4. Update Polylines, User Dot, Markers dynamically & re-fit bounds on route change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([activeStartPoint.lat, activeStartPoint.lng]);
    }

    if (routeGlowRef.current && routeLineRef.current && routeData.points.length > 0) {
      routeGlowRef.current.setLatLngs(routeData.points);
      routeLineRef.current.setLatLngs(routeData.points);
    }

    CAMPUS_DESTINATIONS.forEach((dest) => {
      const isSelected = dest.id === selectedDest.id;
      const marker = markersRef.current[dest.id];
      if (marker) {
        marker.setIcon(createGooglePinIcon(dest, isSelected));
        marker.setZIndexOffset(isSelected ? 800 : 100);
      }
    });

    if (!isNavigating && routeData.points && routeData.points.length >= 2) {
      fitRouteOnScreen();
    }
  }, [activeStartPoint, selectedDest, routeData.points]);

  // Google Maps Red Pin Icon Creator
  function createGooglePinIcon(dest, isSelected) {
    if (isSelected) {
      return L.divIcon({
        className: "google-selected-marker",
        html: `<div class="relative cursor-pointer transition-transform duration-300 transform -translate-x-1/2 -translate-y-full z-50">
          <div class="relative flex flex-col items-center">
            <svg width="34" height="46" viewBox="0 0 34 46" fill="none" class="drop-shadow-lg">
              <path d="M17 0C7.611 0 0 7.611 0 17C0 29.75 17 46 17 46C17 46 34 29.75 34 17C34 7.611 26.389 0 17 0Z" fill="#EA4335"/>
              <circle cx="17" cy="17" r="9" fill="#FFFFFF"/>
            </svg>
            <div class="absolute top-2 text-sm select-none pointer-events-none">
              ${dest.icon}
            </div>
            <div class="absolute -top-7 px-2.5 py-0.5 rounded-md bg-white text-slate-900 text-[11px] font-bold whitespace-nowrap shadow-md border border-slate-200 pointer-events-none flex items-center gap-1">
              <span>${dest.shortName || dest.name}</span>
            </div>
          </div>
        </div>`,
        iconSize: [0, 0],
      });
    }

    return L.divIcon({
      className: "google-poi-marker",
      html: `<div class="relative cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 hover:scale-120 z-20">
        <div class="google-poi-circle" style="background-color: ${dest.color};">
          <span class="text-xs select-none">${dest.icon}</span>
        </div>
      </div>`,
      iconSize: [0, 0],
    });
  }

  // Switch Layer (Roadmap, Satellite, Terrain, OSM)
  const handleLayerChange = (type) => {
    setMapLayerType(type);
    setShowLayerMenu(false);
    if (tileLayerRef.current && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      } catch (e) {
        // ignore
      }
      const subdomains = type === "osm" ? ["a", "b", "c"] : ["0", "1", "2", "3"];
      const newLayer = L.tileLayer(TILE_URLS[type] || TILE_URLS.roadmap, {
        attribution: '&copy; Google Maps & OpenStreetMap',
        maxZoom: 20,
        subdomains,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  };

  // Start Google Maps Live Navigation Simulation
  const startNavigation = () => {
    if (!routeData.points || routeData.points.length < 2) return;
    setIsNavigating(true);

    let step = 0;
    const path = routeData.points;
    const totalSteps = path.length;
    const stepJump = Math.max(1, Math.floor(totalSteps / 14));

    speakInstruction(`Starting navigation to ${selectedDest.name}. Follow the blue route.`);

    navIntervalRef.current = setInterval(() => {
      step += stepJump;
      if (step >= totalSteps - 1 || !path[step]) {
        stopNavigation();
        speakInstruction(`You have arrived at ${selectedDest.name}.`);
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([selectedDest.lat, selectedDest.lng]);
        }
        return;
      }
      if (userMarkerRef.current && path[step]) {
        userMarkerRef.current.setLatLng(path[step]);
        mapInstanceRef.current?.panTo(path[step]);
      }
    }, 1100);
  };

  const stopNavigation = () => {
    if (navIntervalRef.current) clearInterval(navIntervalRef.current);
    navIntervalRef.current = null;
    setIsNavigating(false);
  };

  const focusOnCampus = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([GPREC_CAMPUS.lat, GPREC_CAMPUS.lng], 17);
  };

  const focusOnUser = () => {
    if (!mapInstanceRef.current) return;
    if (!userLocation.isReal) {
      speakInstruction("Detecting your live GPS location...");
      requestLiveLocation();
      return;
    }
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 17, { duration: 0.8 });
    speakInstruction("Centered on your current location.");
  };

  const focusOnSelected = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedDest.lat, selectedDest.lng], 18, { duration: 0.8 });
  };

  const filteredSpots = useMemo(() => {
    return CAMPUS_DESTINATIONS.filter((spot) => {
      const q = searchQuery.toLowerCase();
      return (
        spot.name.toLowerCase().includes(q) ||
        spot.tagline.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  if (!isOpen) return null;

  // Format distance & duration nicely
  const formattedDistance =
    routeData.distanceMeters >= 1000
      ? `${(routeData.distanceMeters / 1000).toFixed(1)} km`
      : `${routeData.distanceMeters} m`;

  const durationMins = Math.max(1, Math.round(routeData.durationSeconds / 60));
  const formattedDuration =
    durationMins >= 60
      ? `${Math.floor(durationMins / 60)} hr ${durationMins % 60} min`
      : `${durationMins} min`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 bg-slate-950/80 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[100dvh] sm:h-[95vh] max-h-[960px] rounded-none sm:rounded-3xl bg-[#f2efe9] shadow-2xl overflow-hidden flex flex-col z-10 font-sans border-0 sm:border border-slate-300"
        >
          {/* Main Map Container */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-[#f2efe9]">
            <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#f2efe9]" />

            {/* 1. Google Maps Emerald Turn-by-Turn Navigation Header */}
            <AnimatePresence>
              {isNavigating && (
                <motion.div
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -80, opacity: 0 }}
                  className="absolute top-0 left-0 right-0 z-30 bg-[#0F9D58] text-white px-4 py-3 shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl shrink-0">
                      ↱
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-bold truncate">
                        Follow the blue Google Maps route to {selectedDest.name}
                      </div>
                      <div className="text-xs text-white/80">
                        {formattedDuration} • {formattedDistance} remaining • Speed 42 km/h
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setVoiceMuted(!voiceMuted)}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                      title={voiceMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
                    >
                      {voiceMuted ? "🔇" : "🔊"}
                    </button>
                    <button
                      type="button"
                      onClick={stopNavigation}
                      className="px-3 py-1 rounded-full bg-white/25 hover:bg-white/35 font-bold text-xs transition-colors"
                    >
                      Exit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Google Maps Floating Search Bar & Quick Destinations (Top Left) */}
            <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 flex flex-col gap-2 max-w-full sm:max-w-xl">
              {/* White Search Box */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-1.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPlacesDrawer(!showPlacesDrawer)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                  title="Toggle Places Menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="flex-1 min-w-0 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search GPREC campus (e.g. csm labs, food court)..."
                    className="w-full py-1.5 px-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}

                  {/* Instant Autocomplete Dropdown */}
                  {searchQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-64 overflow-y-auto p-1.5 z-50 divide-y divide-slate-100">
                      {filteredSpots.length === 0 ? (
                        <div className="p-3 text-xs text-slate-500 text-center">
                          No locations matching "{searchQuery}"
                        </div>
                      ) : (
                        filteredSpots.map((spot) => (
                          <button
                            key={spot.id}
                            type="button"
                            onClick={() => handleSelectDestination(spot)}
                            className="w-full text-left p-2 rounded-xl hover:bg-blue-50/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                          >
                            <span className="text-lg shrink-0">{spot.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {spot.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">{spot.tagline}</div>
                            </div>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                              {spot.category}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Google Blue Directions Action */}
                <button
                  type="button"
                  onClick={fitRouteOnScreen}
                  className="w-8 h-8 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95"
                  title="Show Full Route from Your Location"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zm-9.71 6.3V14h-3a1 1 0 01-1-1v-4h2v3h2V8.41l3.3 3.3-3.3 3.29z" />
                  </svg>
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-label="Close Map"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Travel Mode Pills & Origin Switcher */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-1.5 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTravelMode("drive")}
                    className={`px-2.5 py-1 rounded-xl flex items-center gap-1 font-semibold transition-all ${
                      travelMode === "drive"
                        ? "bg-[#1a73e8] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>🚗</span>
                    <span>Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelMode("bike")}
                    className={`px-2.5 py-1 rounded-xl flex items-center gap-1 font-semibold transition-all ${
                      travelMode === "bike"
                        ? "bg-[#1a73e8] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>🛵</span>
                    <span>Bike</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelMode("walk")}
                    className={`px-2.5 py-1 rounded-xl flex items-center gap-1 font-semibold transition-all ${
                      travelMode === "walk"
                        ? "bg-[#1a73e8] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>🚶</span>
                    <span>Walk</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {userLocation.isReal ? (
                    <button
                      type="button"
                      onClick={() => setOriginMode(originMode === "gps" ? "gate" : "gps")}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        originMode === "gps"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                      title="Click to toggle route origin between your live GPS location and GPREC Main Gate"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      <span>{originMode === "gps" ? "📍 Live GPS Active" : "🚪 From Main Gate"}</span>
                      {originMode === "gps" && (
                        <span className="text-[10px] opacity-90">±{userLocation.accuracy}m</span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={requestLiveLocation}
                      className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Click to detect your live location"
                    >
                      <span>📍</span>
                      <span>{gpsStatus === "requesting" ? "Locating you..." : "Turn On Live GPS"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ⚡ INSTANT DESTINATION SWITCHER PILLS (Clicking immediately reflects and changes destination!) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CAMPUS_DESTINATIONS.map((dest) => {
                  const isSelected = selectedDest.id === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => handleSelectDestination(dest)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap shadow-sm border transition-all ${
                        isSelected
                          ? "bg-[#1a73e8] text-white border-[#1a73e8] font-bold shadow-md scale-105 z-10"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span>{dest.icon}</span>
                      <span>{dest.shortName || dest.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layer Switcher (Top Right) */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className="google-map-btn px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-md cursor-pointer"
                title="Change Map View"
              >
                <span>
                  {mapLayerType === "satellite"
                    ? "🛰️ Satellite Hybrid"
                    : mapLayerType === "terrain"
                    ? "⛰️ Google Terrain"
                    : mapLayerType === "osm"
                    ? "🧭 OpenStreetMap"
                    : "🗺️ Google Roadmap"}
                </span>
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLayerMenu && (
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 flex flex-col gap-1 w-44 text-xs z-30">
                  <button
                    onClick={() => handleLayerChange("roadmap")}
                    className={`p-2 rounded-lg text-left font-medium flex items-center gap-2 cursor-pointer ${
                      mapLayerType === "roadmap" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🗺️</span>
                    <span>Google Roadmap</span>
                  </button>
                  <button
                    onClick={() => handleLayerChange("satellite")}
                    className={`p-2 rounded-lg text-left font-medium flex items-center gap-2 cursor-pointer ${
                      mapLayerType === "satellite" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🛰️</span>
                    <span>Satellite Hybrid</span>
                  </button>
                  <button
                    onClick={() => handleLayerChange("terrain")}
                    className={`p-2 rounded-lg text-left font-medium flex items-center gap-2 cursor-pointer ${
                      mapLayerType === "terrain" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>⛰️</span>
                    <span>Google Terrain</span>
                  </button>
                  <button
                    onClick={() => handleLayerChange("osm")}
                    className={`p-2 rounded-lg text-left font-medium flex items-center gap-2 cursor-pointer ${
                      mapLayerType === "osm" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🧭</span>
                    <span>OpenStreetMap</span>
                  </button>
                </div>
              )}
            </div>

            {/* Recenter, Campus & Zoom Buttons (Bottom Right) */}
            <div className="absolute bottom-28 sm:bottom-6 right-3 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={focusOnUser}
                className="google-map-btn w-10 h-10 flex items-center justify-center text-lg text-slate-700"
                title="Center on my location"
              >
                🎯
              </button>

              <button
                type="button"
                onClick={focusOnCampus}
                className="google-map-btn w-10 h-10 flex items-center justify-center text-lg text-slate-700"
                title="Center on GPREC Campus"
              >
                🏫
              </button>

              <button
                type="button"
                onClick={fitRouteOnScreen}
                className="google-map-btn w-10 h-10 flex items-center justify-center text-lg text-blue-600 font-bold"
                title="Fit full route"
              >
                🧭
              </button>

              <div className="google-map-btn flex flex-col overflow-hidden">
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg border-b border-slate-200"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg"
                >
                  −
                </button>
              </div>
            </div>

            {/* Google Watermark */}
            <div className="absolute bottom-1 left-2 z-10 flex items-center gap-1.5 text-[11px] text-slate-600 bg-white/75 px-2 py-0.5 rounded-md backdrop-blur-xs pointer-events-none">
              <span className="font-bold text-slate-800">Google</span>
              <span>Map data ©{new Date().getFullYear()}</span>
            </div>

            {/* 3. Google Maps Bottom Sheet Card with Live Route, Time & Floor Directory */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 max-w-full sm:max-w-xl">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 sm:p-4">
                {/* Header: Title, Category & Travel Stats */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                        {selectedDest.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {selectedDest.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="text-amber-500 font-bold">★ {selectedDest.rating}</span>
                      <span>({selectedDest.reviewsCount})</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{selectedDest.hours}</span>
                    </div>
                  </div>

                  {/* Travel Time & Distance Badge */}
                  <div className="text-right shrink-0 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                    <div className="text-base sm:text-lg font-bold text-emerald-800 leading-tight">
                      {routeData.loading ? "..." : formattedDuration}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      {routeData.loading ? "Calculating..." : `${formattedDistance} • ${travelMode}`}
                    </div>
                  </div>
                </div>

                {/* Route Origin & Path Status */}
                <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-400 font-semibold">From:</span>
                    <span className="font-bold text-slate-700 truncate">
                      {activeStartPoint.label}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-semibold shrink-0">
                    Fastest Route
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">
                  {selectedDest.description}
                </p>

                {/* SPECIAL: CSM Floor Directory (if CSM Labs or CSM Department) */}
                {selectedDest.floorsDirectory && selectedDest.floorsDirectory.length > 0 && (
                  <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <span>🏢</span>
                        <span>CSM Block Floor Directory (gprec.ac.in):</span>
                      </div>

                      {/* Floor Tabs */}
                      <div className="flex items-center gap-1">
                        {selectedDest.floorsDirectory.map((f) => (
                          <button
                            key={f.floor}
                            onClick={() => setSelectedFloorTab(f.floor)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                              selectedFloorTab === f.floor
                                ? "bg-[#1a73e8] text-white shadow-xs"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {f.floor}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Floor Content */}
                    {(() => {
                      const activeFloor =
                        selectedDest.floorsDirectory.find((f) => f.floor === selectedFloorTab) ||
                        selectedDest.floorsDirectory[0];
                      return (
                        <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-700">{activeFloor.labs}</span>
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              {activeFloor.floor}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            <strong>Workstations:</strong> {activeFloor.equipment}
                          </div>
                          <div className="text-slate-600">
                            <strong>Subjects:</strong> {activeFloor.subjects}
                          </div>
                          {activeFloor.specialFeature && (
                            <div className="text-emerald-700 font-semibold pt-0.5">
                              {activeFloor.specialFeature}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Google Maps Action Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={isNavigating ? stopNavigation : startNavigation}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                      isNavigating
                        ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
                        : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                    }`}
                  >
                    <span>{isNavigating ? "⏸️ Pause Navigation" : "🚗 Start Live Navigation"}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${activeStartPoint.lat},${activeStartPoint.lng}&destination=${selectedDest.lat},${selectedDest.lng}&travelmode=${travelMode === "bike" ? "two-wheeler" : travelMode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1a73e8] text-xs font-bold transition-colors flex items-center gap-1 border border-blue-200 shrink-0 cursor-pointer"
                    title="Open in Official Google Maps app/website"
                  >
                    <span>🗺️</span>
                    <span className="hidden sm:inline">Google Maps</span>
                    <span className="text-[10px]">↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      speakInstruction(
                        `Route to ${selectedDest.name}. Total distance is ${formattedDistance}, taking about ${formattedDuration}.`
                      );
                    }}
                    className="py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Voice Directions"
                  >
                    <span>🔊</span>
                    <span className="hidden sm:inline">Voice</span>
                  </button>

                  <button
                    type="button"
                    onClick={focusOnSelected}
                    className="py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Center on Spot"
                  >
                    <span>🎯</span>
                    <span className="hidden sm:inline">Focus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Google Maps Places Side Drawer */}
            <AnimatePresence>
              {showPlacesDrawer && (
                <motion.div
                  initial={{ x: -360 }}
                  animate={{ x: 0 }}
                  exit={{ x: -360 }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="absolute top-0 bottom-0 left-0 w-80 sm:w-88 bg-white z-40 shadow-2xl border-r border-slate-200 flex flex-col"
                >
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏫</span>
                      <h3 className="font-bold text-sm text-slate-900">
                        GPREC Campus Places ({CAMPUS_DESTINATIONS.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowPlacesDrawer(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-2.5 bg-blue-50/60 border-b border-blue-100 text-[11px] text-blue-900 flex items-center justify-between">
                    <span>Route Origin:</span>
                    <span className="font-bold truncate">{activeStartPoint.label}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                    {filteredSpots.map((dest) => {
                      const isSelected = selectedDest.id === dest.id;
                      const dist = calculateDistanceMeters(
                        activeStartPoint.lat,
                        activeStartPoint.lng,
                        dest.lat,
                        dest.lng
                      );
                      const displayDist =
                        dist >= 1000 ? `${(dist / 1000).toFixed(1)} km` : `${dist} m`;

                      return (
                        <button
                          key={dest.id}
                          onClick={() => handleSelectDestination(dest)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                            isSelected
                              ? "bg-blue-50/90 border-[#1a73e8] shadow-sm"
                              : "bg-white hover:bg-slate-50 border-transparent hover:border-slate-200"
                          }`}
                        >
                          <span
                            className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 shadow-xs"
                            style={{ backgroundColor: `${dest.color}15`, color: dest.color }}
                          >
                            {dest.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4
                                className={`text-xs font-bold truncate ${
                                  isSelected ? "text-[#1a73e8]" : "text-slate-800"
                                }`}
                              >
                                {dest.name}
                              </h4>
                              <span className="text-[10px] font-bold text-[#1a73e8] shrink-0">
                                {displayDist}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {dest.tagline}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="text-amber-500 font-bold">★ {dest.rating}</span>
                              <span>•</span>
                              <span>{dest.category}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
