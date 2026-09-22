// Official visitor-focused GPREC campus data sourced from www.gprec.ac.in and CIE GPREC

export const GPREC_INFO = {
  name: "G. Pulla Reddy Engineering College (Autonomous)",
  shortName: "GPREC Kurnool",
  established: "Est. 1984 • Autonomous • NAAC 'A+' & NBA Accredited",
  location: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, AP - 518007",
  gps: { lat: 15.8073, lng: 78.0375 },
  website: "https://www.gprec.ac.in",
  tagline: "Premier autonomous engineering campus & home of CodeX Hackathons and CIE Innovation Hub",
  visitorHighlight: "Spanning 30+ lush green acres with cutting-edge Intel AI labs, CIE startup incubator, modern food courts, and a vibrant tech community."
};

// =========================================================================
// 1. STRUCTURED CAMPUS NAVIGATION NODES & WAYPOINTS
// Exact geometric corridor alignment to ensure routes stay on walkways
// =========================================================================
export const CAMPUS_NAV_NODES = {
  node_main_gate: { id: "node_main_gate", x: 500, y: 660, label: "Main Entrance Gate (Nandyal Rd)", lat: 15.8073, lng: 78.0375 },
  node_gate_atm: { id: "node_gate_atm", x: 570, y: 640, label: "24/7 ATM & Health Dispensary", lat: 15.8074, lng: 78.0378 },
  node_gate_junction: { id: "node_gate_junction", x: 500, y: 590, label: "Entrance Avenue Junction", lat: 15.8076, lng: 78.0375 },
  node_auditorium_entry: { id: "node_auditorium_entry", x: 390, y: 560, label: "Auditorium Entrance", lat: 15.8078, lng: 78.0368 },
  node_central_avenue_mid: { id: "node_central_avenue_mid", x: 500, y: 470, label: "Central Avenue & Food Plaza Cross", lat: 15.8082, lng: 78.0375 },
  node_canteen_junction: { id: "node_canteen_junction", x: 420, y: 470, label: "Main Cafeteria & Canteen Plaza", lat: 15.8082, lng: 78.0370 },
  node_food_court_entry: { id: "node_food_court_entry", x: 560, y: 470, label: "Campus Food Court & Canopy Seating", lat: 15.8082, lng: 78.0380 },
  node_quad_circle: { id: "node_quad_circle", x: 500, y: 360, label: "Central Quadrangle Roundabout", lat: 15.8088, lng: 78.0375 },
  node_library_entry: { id: "node_library_entry", x: 420, y: 300, label: "Central Library & Digital Wing", lat: 15.8091, lng: 78.0369 },
  node_cie_entry: { id: "node_cie_entry", x: 590, y: 390, label: "CIE Innovation Hub", lat: 15.8085, lng: 78.0383 },
  node_csm_entry: { id: "node_csm_entry", x: 710, y: 370, label: "CSM Block (Intel AI/ML Hub)", lat: 15.8088, lng: 78.0388 },
  node_drone_entry: { id: "node_drone_entry", x: 720, y: 460, label: "Drone & Robotics Research Lab", lat: 15.8084, lng: 78.0392 },
  node_amphi_entry: { id: "node_amphi_entry", x: 540, y: 310, label: "Open Air Amphitheatre (\"Amphi\")", lat: 15.8093, lng: 78.0382 },
  node_cse_entry: { id: "node_cse_entry", x: 670, y: 245, label: "CSE Department Block", lat: 15.8096, lng: 78.0388 },
  node_ece_entry: { id: "node_ece_entry", x: 500, y: 200, label: "ECE & EEE Department Block", lat: 15.8098, lng: 78.0376 },
  node_mech_entry: { id: "node_mech_entry", x: 350, y: 160, label: "Mechanical & Civil Workshops", lat: 15.8097, lng: 78.0363 },
  node_sports_entry: { id: "node_sports_entry", x: 760, y: 170, label: "Indoor Sports Stadium & Grounds", lat: 15.8099, lng: 78.0395 }
};

// Road and Walkway Graph Connections (edges with distance in meters)
export const CAMPUS_NAV_GRAPH = {
  node_main_gate: [
    { target: "node_gate_atm", dist: 35 },
    { target: "node_gate_junction", dist: 70 }
  ],
  node_gate_atm: [
    { target: "node_main_gate", dist: 35 },
    { target: "node_gate_junction", dist: 65 }
  ],
  node_gate_junction: [
    { target: "node_main_gate", dist: 70 },
    { target: "node_gate_atm", dist: 65 },
    { target: "node_auditorium_entry", dist: 80 },
    { target: "node_central_avenue_mid", dist: 120 }
  ],
  node_auditorium_entry: [
    { target: "node_gate_junction", dist: 80 },
    { target: "node_canteen_junction", dist: 90 }
  ],
  node_central_avenue_mid: [
    { target: "node_gate_junction", dist: 120 },
    { target: "node_canteen_junction", dist: 80 },
    { target: "node_food_court_entry", dist: 60 },
    { target: "node_quad_circle", dist: 110 }
  ],
  node_canteen_junction: [
    { target: "node_central_avenue_mid", dist: 80 },
    { target: "node_auditorium_entry", dist: 90 },
    { target: "node_library_entry", dist: 130 }
  ],
  node_food_court_entry: [
    { target: "node_central_avenue_mid", dist: 60 },
    { target: "node_cie_entry", dist: 75 }
  ],
  node_quad_circle: [
    { target: "node_central_avenue_mid", dist: 110 },
    { target: "node_library_entry", dist: 90 },
    { target: "node_cie_entry", dist: 95 },
    { target: "node_csm_entry", dist: 150 },
    { target: "node_amphi_entry", dist: 65 },
    { target: "node_ece_entry", dist: 130 }
  ],
  node_library_entry: [
    { target: "node_quad_circle", dist: 90 },
    { target: "node_canteen_junction", dist: 130 },
    { target: "node_mech_entry", dist: 120 }
  ],
  node_cie_entry: [
    { target: "node_food_court_entry", dist: 75 },
    { target: "node_quad_circle", dist: 95 },
    { target: "node_csm_entry", dist: 90 }
  ],
  node_csm_entry: [
    { target: "node_quad_circle", dist: 150 },
    { target: "node_cie_entry", dist: 90 },
    { target: "node_drone_entry", dist: 70 },
    { target: "node_cse_entry", dist: 120 }
  ],
  node_drone_entry: [
    { target: "node_csm_entry", dist: 70 }
  ],
  node_amphi_entry: [
    { target: "node_quad_circle", dist: 65 },
    { target: "node_cse_entry", dist: 110 }
  ],
  node_cse_entry: [
    { target: "node_csm_entry", dist: 120 },
    { target: "node_amphi_entry", dist: 110 },
    { target: "node_sports_entry", dist: 95 },
    { target: "node_ece_entry", dist: 140 }
  ],
  node_ece_entry: [
    { target: "node_quad_circle", dist: 130 },
    { target: "node_cse_entry", dist: 140 },
    { target: "node_mech_entry", dist: 130 }
  ],
  node_mech_entry: [
    { target: "node_library_entry", dist: 120 },
    { target: "node_ece_entry", dist: 130 }
  ],
  node_sports_entry: [
    { target: "node_cse_entry", dist: 95 }
  ]
};

// =========================================================================
// 2. CAMPUS MAP VISUAL ELEMENTS (BUILDINGS, ROADS, GREENERY)
// =========================================================================
export const CAMPUS_MAP_DATA = {
  viewBox: "0 0 1000 720",
  dimensions: { width: 1000, height: 720 },
  roads: [
    { id: "main-avenue", d: "M 500 660 L 500 360", width: 28, label: "Central Avenue" },
    { id: "south-junction", d: "M 390 560 L 500 590 L 570 640", width: 20 },
    { id: "canteen-cross", d: "M 420 470 L 560 470", width: 18, label: "Food Plaza Walkway" },
    { id: "quad-ring", d: "M 500 360 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0", width: 22 },
    { id: "innovation-way", d: "M 500 360 L 710 370 L 720 460", width: 18, label: "Innovation Way" },
    { id: "cie-link", d: "M 560 470 L 590 390 L 500 360", width: 16 },
    { id: "amphi-connector", d: "M 500 360 L 540 310 L 670 245", width: 16 },
    { id: "north-avenue", d: "M 500 360 L 500 200 L 670 245 L 760 170", width: 16 },
    { id: "west-lane", d: "M 500 360 L 420 300 L 350 160 L 500 200", width: 18, label: "Academic West Lane" },
    { id: "canteen-library-link", d: "M 420 470 L 420 300", width: 16 }
  ],
  greenery: [
    { id: "lawn-quad", cx: 500, cy: 360, r: 30, label: "Central Garden" },
    { id: "lawn-east", x: 620, y: 280, w: 70, h: 65, rx: 10, label: "East Lawn" },
    { id: "lawn-canteen", x: 440, y: 500, w: 50, h: 50, rx: 8 },
    { id: "sports-ground", x: 740, y: 220, w: 160, h: 100, rx: 16, label: "Athletic Ground" }
  ],
  buildings: [
    {
      id: "csm-block",
      name: "CSM Block (Intel AI/ML Hub)",
      code: "CSM",
      x: 730,
      y: 320,
      w: 130,
      h: 95,
      zone: "academic-zone",
      category: "hackathon",
      color: "blue",
      markerId: "csm-labs",
      nodeId: "node_csm_entry"
    },
    {
      id: "cie-hub",
      name: "CIE Innovation Hub",
      code: "CIE",
      x: 605,
      y: 390,
      w: 95,
      h: 65,
      zone: "academic-zone",
      category: "startups",
      color: "indigo",
      markerId: "cie-hub",
      nodeId: "node_cie_entry"
    },
    {
      id: "drone-lab",
      name: "Drone & Robotics Lab",
      code: "DRONE",
      x: 740,
      y: 435,
      w: 95,
      h: 60,
      zone: "academic-zone",
      category: "hackathon",
      color: "cyan",
      markerId: "drone-robotics-lab",
      nodeId: "node_drone_entry"
    },
    {
      id: "cse-building",
      name: "CSE Department Block",
      code: "CSE",
      x: 690,
      y: 140,
      w: 125,
      h: 85,
      zone: "academic-zone",
      category: "hackathon",
      color: "blue",
      markerId: "cse-block",
      nodeId: "node_cse_entry"
    },
    {
      id: "ece-eee-building",
      name: "ECE & EEE Block",
      code: "ECE/EEE",
      x: 440,
      y: 100,
      w: 130,
      h: 80,
      zone: "academic-zone",
      category: "hackathon",
      color: "amber",
      markerId: "ece-eee-block",
      nodeId: "node_ece_entry"
    },
    {
      id: "mech-civil-building",
      name: "Mechanical & Civil Workshops",
      code: "MECH/CIV",
      x: 190,
      y: 110,
      w: 140,
      h: 90,
      zone: "academic-zone",
      category: "startups",
      color: "orange",
      markerId: "mech-civil-block",
      nodeId: "node_mech_entry"
    },
    {
      id: "auditorium-building",
      name: "Auditorium",
      code: "AUDITORIUM",
      x: 230,
      y: 520,
      w: 140,
      h: 80,
      zone: "common-facilities-zone",
      category: "venues",
      color: "purple",
      markerId: "auditorium",
      nodeId: "node_auditorium_entry"
    },
    {
      id: "library-building",
      name: "Central Library & Digital Wing",
      code: "LIBRARY",
      x: 270,
      y: 250,
      w: 130,
      h: 85,
      zone: "common-facilities-zone",
      category: "library",
      color: "emerald",
      markerId: "central-library",
      nodeId: "node_library_entry"
    },
    {
      id: "amphitheatre-area",
      name: "Open Air Amphitheatre",
      code: "AMPHI",
      x: 550,
      y: 240,
      w: 90,
      h: 65,
      zone: "common-facilities-zone",
      category: "venues",
      color: "teal",
      markerId: "amphitheatre",
      nodeId: "node_amphi_entry"
    },
    {
      id: "canteen-building",
      name: "Main Cafeteria & Canteen",
      code: "CANTEEN",
      x: 270,
      y: 430,
      w: 130,
      h: 75,
      zone: "common-facilities-zone",
      category: "food",
      color: "rose",
      markerId: "cafeteria",
      nodeId: "node_canteen_junction"
    },
    {
      id: "food-court-area",
      name: "Campus Food Court",
      code: "FOOD COURT",
      x: 570,
      y: 470,
      w: 110,
      h: 70,
      zone: "common-facilities-zone",
      category: "food",
      color: "amber",
      markerId: "food-court",
      nodeId: "node_food_court_entry"
    },
    {
      id: "sports-stadium",
      name: "Indoor Sports Complex & Gym",
      code: "SPORTS",
      x: 780,
      y: 80,
      w: 110,
      h: 75,
      zone: "common-facilities-zone",
      category: "venues",
      color: "emerald",
      markerId: "indoor-stadium",
      nodeId: "node_sports_entry"
    },
    {
      id: "gate-amenities",
      name: "Security Gate, ATM & Health Center",
      code: "GATE/ATM",
      x: 460,
      y: 630,
      w: 130,
      h: 45,
      zone: "common-facilities-zone",
      category: "amenities",
      color: "slate",
      markerId: "atm-health-amenities",
      nodeId: "node_main_gate"
    }
  ]
};

// =========================================================================
// 3. MAIN CAMPUS ZONES & DETAILED DIRECTORY
// =========================================================================
export const CAMPUS_ZONES = [
  {
    id: "academic-zone",
    name: "Academic, Tech & Innovation Area",
    shortName: "Academic & Tech Hub",
    subtitle: "Department blocks, Intel AI labs, CIE innovation hub & software centres",
    icon: "🏛️",
    badge: "Zone 1",
    themeColor: "blue",
    overview: "Where cutting-edge engineering, AI research, and hackathon coding happen at GPREC.",
    facilities: [
      {
        id: "csm-labs",
        name: "CSM Computer Labs & Intel AI/ML Center",
        shortName: "CSM Labs (Hackathon Arena)",
        icon: "💻",
        area: "East Academic Quadrangle • Ground to 2nd Floor",
        badge: "CodeX 4.0 Hackathon Hub",
        category: "hackathon",
        nodeId: "node_csm_entry",
        mapCoords: { x: 710, y: 370 },
        isHackathonHub: true,
        facilityTag: "CSM Block • 8 Labs",
        whatYouShouldKnow: "Primary arena for CodeX and hackathon rounds. High-speed Lenovo ThinkCentre Neo 50S (i5 12th Gen, 16GB RAM) workstations, ultra-low latency 1 Gbps fiber internet, dual-port power per bench, and round-the-clock technical mentor desk.",
        summary: "State-of-the-art Intel Unnati AI/ML Center (CSM Lab 6), Drone & Robotics Lab, Python, and high-performance computing suites.",
        highlights: [
          { icon: "💻", text: "Ground Floor: Core Programming Labs 1 & 2 (Lenovo ThinkCentre Neo 50S) and Drone & Robotics Research Lab" },
          { icon: "🖥️", text: "1st Floor: Advanced Software, DBMS & Web Labs 3–5 plus multimedia tutorial seminar halls" },
          { icon: "⚡", text: "2nd Floor: Intel Unnati AI/ML Center (CSM Lab 6) with high-end workstations — primary arena for CodeX 4.0 Hackathon" },
          { icon: "🔋", text: "Equipped with 1 Gbps redundant campus fiber-optic internet and 100% online UPS power backup" }
        ],
        keywords: ["csm", "intel", "ai", "ml", "hackathon", "workstation", "pc", "computer", "lab", "lab 6", "wifi", "internet", "power", "charging", "mentor", "code", "programming", "python", "gpu"],
        queryPrompt: "Tell me about CSM Computer Labs and the Intel AI/ML Lab at GPREC"
      },
      {
        id: "cie-hub",
        name: "CIE Innovation Hub",
        shortName: "CIE Innovation Hub",
        icon: "🚀",
        area: "Ground Floor, Central Academic Wing",
        badge: "Startups & Incubation",
        category: "startups",
        nodeId: "node_cie_entry",
        mapCoords: { x: 590, y: 390 },
        facilityTag: "CIE • Innovation Wing",
        whatYouShouldKnow: "Center for Innovation and Entrepreneurship (CIE) at GPREC. Dedicated incubation hub supporting student startups, technical prototyping, patent guidance, and seed funding consultation for innovative hardware and software projects.",
        summary: "GPREC's official center for innovation, startup incubation, patent support, and student-led entrepreneurship.",
        highlights: [
          { icon: "💡", text: "Centre for Innovation & Entrepreneurship (CIE): Incubation support for tech prototypes and student-led startups" },
          { icon: "🛠️", text: "Prototyping equipment, 3D printing access, hardware assembly benches, and whiteboard meeting rooms" },
          { icon: "📈", text: "Regular startup mentoring, patent filing assistance, and government innovation funding guidance" }
        ],
        keywords: ["cie", "innovation", "startup", "incubation", "entrepreneurship", "mentor", "helpdesk", "registration", "whiteboard", "prototype", "funding", "ideasprint"],
        queryPrompt: "Tell me about the CIE Innovation Center at GPREC"
      },
      {
        id: "cse-block",
        name: "Computer Science & Engineering (CSE) Block",
        shortName: "CSE Block",
        icon: "🖥️",
        area: "Central-East Academic Wing • Ground to 2nd Floor",
        badge: "Computing Core",
        category: "hackathon",
        nodeId: "node_cse_entry",
        mapCoords: { x: 670, y: 245 },
        facilityTag: "CSE Block • Smart Halls",
        whatYouShouldKnow: "Core computing department with smart lecture halls and cloud computing testbeds. Features Linux terminal stations, network simulation rigs, and faculty consultation chambers for external participants.",
        summary: "Core CSE lecture theatres, advanced networking suites, cloud labs, and faculty research chambers.",
        highlights: [
          { icon: "🖥️", text: "Spacious tiered lecture halls equipped with digital smart boards and 4K projectors" },
          { icon: "🌐", text: "Specialized networking, operating systems, and distributed systems cloud laboratories" }
        ],
        keywords: ["cse", "computer science", "lecture", "cloud", "networking", "smart board", "terminal", "linux", "professors", "faculty", "halls"],
        queryPrompt: "Tell me about the CSE Department Block at GPREC"
      },
      {
        id: "ece-eee-block",
        name: "ECE & EEE Department Block",
        shortName: "ECE / EEE Block",
        icon: "⚡",
        area: "North-East Academic Wing • Ground to 3rd Floor",
        badge: "Hardware & IoT",
        category: "hackathon",
        nodeId: "node_ece_entry",
        mapCoords: { x: 500, y: 200 },
        facilityTag: "ECE/EEE • Hardware Labs",
        whatYouShouldKnow: "Hardware prototyping hub for electronics and electrical engineering. Features Raspberry Pi, Arduino, ESP32 development kits, VLSI testing, and high-voltage electrical machinery labs.",
        summary: "Electronics & Communication and Electrical engineering hubs housing advanced microprocessors, DSP, and renewable energy testbeds.",
        highlights: [
          { icon: "🔌", text: "Microprocessor, embedded systems, and VLSI circuit prototyping labs with test equipment" },
          { icon: "⚡", text: "High-voltage electrical machinery, smart grid, and power systems research suites" }
        ],
        keywords: ["ece", "eee", "hardware", "iot", "arduino", "raspberry pi", "sensor", "vlsi", "electronics", "circuit", "soldering", "embedded", "oscilloscope"],
        queryPrompt: "Tell me about the ECE and EEE Department at GPREC"
      },
      {
        id: "drone-robotics-lab",
        name: "Drone & Robotics Research Lab",
        shortName: "Drone & Robotics Lab",
        icon: "🤖",
        area: "Ground Floor, CSM Academic Block",
        badge: "Robotics & UAVs",
        category: "hackathon",
        nodeId: "node_drone_entry",
        mapCoords: { x: 720, y: 460 },
        facilityTag: "Robotics Arena",
        whatYouShouldKnow: "Ground floor CSM block facility dedicated to autonomous quadcopters, fixed-wing UAVs, computer vision obstacle avoidance, and ROS (Robot Operating System) robotics.",
        summary: "Specialized laboratory for unmanned aerial vehicles (UAVs), computer vision navigation, and IoT sensor integration.",
        highlights: [
          { icon: "🚁", text: "Dedicated hardware assembly benches and drone flight testing arena" },
          { icon: "🎯", text: "Autonomous navigation and obstacle-detection algorithms powered by AI edge devices" }
        ],
        keywords: ["drone", "robotics", "uav", "quadcopter", "lidar", "ros", "px4", "camera", "sensor", "flight", "autonomous", "edge ai"],
        queryPrompt: "Tell me about the Drone and Robotics Lab at GPREC"
      },
      {
        id: "mech-civil-block",
        name: "Mechanical & Civil Block & Central Workshops",
        shortName: "Mech & Civil Block",
        icon: "⚙️",
        area: "South-West Academic Wing • Ground to 2nd Floor",
        badge: "Design & Manufacturing",
        category: "startups",
        nodeId: "node_mech_entry",
        mapCoords: { x: 350, y: 160 },
        facilityTag: "Central Workshops",
        whatYouShouldKnow: "Central workshops housing heavy mechanical machinery, CNC milling, lathe equipment, structural engineering rigs, and 3D printing manufacturing units.",
        summary: "Central mechanical engineering workshops, 3D design centers, concrete testing, and fluid dynamics testing rigs.",
        highlights: [
          { icon: "🏭", text: "CNC machining centers, 3D printing facilities, and automated welding workshops" },
          { icon: "🏗️", text: "Civil structural analysis, soil mechanics, and fluid dynamics hydraulics labs" }
        ],
        keywords: ["mechanical", "civil", "workshop", "cnc", "3d printing", "manufacturing", "cad", "cam", "solidworks", "ansys", "lathe", "machinery"],
        queryPrompt: "Tell me about the Mechanical and Civil Engineering Block at GPREC"
      }
    ]
  },
  {
    id: "common-facilities-zone",
    name: "Student Life, Venues & Common Facilities",
    shortName: "Student Life & Venues",
    subtitle: "Auditorium, Amphitheatre, Food Court, Canteen & Library",
    icon: "🌟",
    badge: "Zone 2",
    themeColor: "emerald",
    overview: "Key gathering venues, dining hotspots, sports arenas, and visitor conveniences at GPREC.",
    facilities: [
      {
        id: "auditorium",
        name: "Auditorium",
        shortName: "Auditorium",
        icon: "🎭",
        area: "Near Main Campus Entrance Gate",
        badge: "Keynotes & Ceremonies",
        category: "venues",
        nodeId: "node_auditorium_entry",
        mapCoords: { x: 390, y: 560 },
        facilityTag: "AC Event Hall",
        whatYouShouldKnow: "Grand air-conditioned auditorium situated right near the Main Gate. Official venue for CodeX 4.0 opening ceremony, guest keynotes (Dodagatta Nihar), and university awards. Features Bose line-array audio, motorized projection, and executive VIP lounge.",
        amenityTags: ["Full Air-Conditioned", "Bose Audio", "Dual 4K Projectors", "VIP Green Rooms"],
        summary: "Acoustically engineered grand indoor auditorium with Bose audio systems, dual high-lumen projectors, and VIP executive suites.",
        highlights: [
          { icon: "🎭", text: "Premier indoor hall for inaugural sessions, guest keynotes, and award ceremonies" },
          { icon: "🎙️", text: "Host venue for keynote speaker Dodagatta Nihar and national technical conferences" },
          { icon: "🚶", text: "Just a 1-minute walk from the Main Entrance Security Gate" }
        ],
        keywords: ["auditorium", "keynote", "ceremony", "inauguration", "speaker", "nihar", "hall", "ac", "stage", "sound", "projector"],
        queryPrompt: "Tell me about the Auditorium at GPREC"
      },
      {
        id: "amphitheatre",
        name: "Open Air Amphitheatre (\"Amphi\")",
        shortName: "Open Air Amphitheatre",
        icon: "🎤",
        area: "Central Lawn • Next to CSM Quadrangle",
        badge: "Social & Cultural Hub",
        category: "venues",
        nodeId: "node_amphi_entry",
        mapCoords: { x: 540, y: 310 },
        facilityTag: "800+ Open Air Arena",
        whatYouShouldKnow: "GPREC's favorite outdoor social hangout. Tiered semi-circular stone steps under shady trees, perfect for evening guitar jams, team mixers, pitch dry-runs, and hackathon fresh-air breaks.",
        amenityTags: ["800+ Tiered Seating", "Open-Air Lawn", "Acoustic Courtyard", "Evening Lighting", "Tree Shaded"],
        summary: "Tiered semi-circular stone terrace arena accommodating 800+ students for cultural fests, club meetups, and open-air ceremonies.",
        highlights: [
          { icon: "🌳", text: "Premier social gathering arena surrounded by lush green lawns and shade trees" },
          { icon: "🎸", text: "Popular spot for hackathon break sessions, project showcases, and team networking" }
        ],
        keywords: ["amphi", "amphitheatre", "open air", "lawn", "stage", "cultural", "fest", "mixer", "social", "evening", "seating", "steps", "jam"],
        queryPrompt: "Tell me about the Open Air Amphitheatre at GPREC"
      },
      {
        id: "food-court",
        name: "Campus Canteen & Cafeteria",
        shortName: "Campus Canteen",
        icon: "☕",
        area: "Central Amenities Wing",
        badge: "Canteen & Refreshments",
        category: "food",
        nodeId: "node_food_court_entry",
        mapCoords: { x: 560, y: 470 },
        facilityTag: "Canteen • Student & Staff Facility",
        whatYouShouldKnow: "Official campus canteen facility at GPREC providing fresh snacks, tea, coffee, and refreshments for students and staff throughout college hours. Managed with oversight from the institutional Canteen Committee (comprising faculty and student representatives) to maintain strict cleanliness, hygiene, and subsidized student-friendly pricing.",
        amenityTags: ["Refreshments & Snacks", "Tea & Coffee", "Canteen Committee Monitored", "Subsidized Rates", "Clean Dining Space"],
        summary: "Official GPREC campus canteen providing fresh snacks, tea, coffee, and daily refreshments supervised by the institutional Canteen Committee.",
        highlights: [
          { icon: "☕", text: "Fresh tea, filter coffee, snacks, and refreshments available throughout college hours" },
          { icon: "🛡️", text: "Quality, cleanliness, and student-friendly pricing monitored by the institutional Canteen Committee" },
          { icon: "👥", text: "Central socializing and refreshment space for students and faculty between academic sessions" }
        ],
        keywords: ["canteen", "cafeteria", "tea", "coffee", "snacks", "refreshments", "food", "dining", "canteen committee", "hygiene"],
        queryPrompt: "Tell me about the GPREC campus canteen and cafeteria facilities"
      },
      {
        id: "cafeteria",
        name: "College Canteen Dining Hall",
        shortName: "Dining Hall",
        icon: "🍴",
        area: "South-East Dining Block",
        badge: "Meals & Refreshments",
        category: "food",
        nodeId: "node_canteen_junction",
        mapCoords: { x: 420, y: 470 },
        facilityTag: "Open College Hours",
        whatYouShouldKnow: "Spacious dining hall providing wholesome meals, breakfast, and refreshments for students and staff throughout college working hours under Canteen Committee hygiene supervision.",
        amenityTags: ["Wholesome Meals", "Breakfast & Snacks", "Subsidized Rates", "Faculty & Student Dining"],
        summary: "Hygiene-monitored institutional cafeteria serving fresh breakfast, lunch, and daily refreshments supervised by the GPREC Canteen Committee.",
        highlights: [
          { icon: "🍲", text: "Freshly prepared breakfast and lunch meals for students and faculty" },
          { icon: "☕", text: "Tea, coffee, and light refreshments served throughout working hours" },
          { icon: "🛡️", text: "Clean dining space with active Canteen Committee supervision" }
        ],
        keywords: ["canteen", "cafeteria", "dining", "meals", "breakfast", "lunch", "refreshments", "tea", "coffee"],
        queryPrompt: "What are the GPREC Canteen dining facilities?"
      },
      {
        id: "central-library",
        name: "Central Library & Digital Wing",
        shortName: "Central Library",
        icon: "📚",
        area: "Central Academic Quadrangle",
        badge: "Digital Research",
        category: "library",
        nodeId: "node_library_entry",
        mapCoords: { x: 420, y: 300 },
        facilityTag: "66,106 Volumes • SLIM 21",
        whatYouShouldKnow: "Fully automated library with SLIM 21 software featuring 66,106 volumes, 14,153 titles, and subscriptions to 84 National and 979 International Journals. Includes a spacious reading room and an Electronics Resources Wing (Digital Library) with online access to IEEE Xplore, ScienceDirect (Elsevier), ASME, ASCE, INFLIBNET (NLIST), DELNET, and NPTEL video courses. Open 9:00 AM to 7:00 PM.",
        amenityTags: ["66,106 Volumes", "14,153 Titles", "IEEE Xplore & ScienceDirect", "SLIM 21 Automated", "Open 9 AM – 7 PM"],
        summary: "Fully automated with SLIM 21 library management software, offering 66,106 volumes, 14,153 titles, and spacious reading halls.",
        highlights: [
          { icon: "📖", text: "66,106+ volumes & 14,153 titles covering engineering, AI, basic sciences, and competitive exams" },
          { icon: "💻", text: "Digital Library (Electronics Resources Wing) with IEEE Xplore, ScienceDirect, and NPTEL access" },
          { icon: "🕒", text: "Open 9:00 AM to 7:00 PM with spacious reference and reading sections" }
        ],
        keywords: ["library", "books", "ieee", "research", "digital", "quiet", "study", "reading", "slim 21", "journals", "photocopy", "print", "nptel"],
        queryPrompt: "Tell me about the Central Library facilities, digital resources, and timings at GPREC"
      },
      {
        id: "indoor-stadium",
        name: "Sports Complex & Indoor Stadium",
        shortName: "Indoor Stadium & Grounds",
        icon: "🏟️",
        area: "Sports Wing & Playgrounds",
        badge: "Sports & Games",
        category: "venues",
        nodeId: "node_sports_entry",
        mapCoords: { x: 760, y: 170 },
        facilityTag: "Indoor Stadium & Sports Grounds",
        whatYouShouldKnow: "Sports and games facilities managed by the official Sports & Games Committee. Features a multipurpose Indoor Stadium for badminton tournaments, table tennis, carrom, and chess, along with outdoor grounds and courts for cricket, basketball, volleyball, and football.",
        amenityTags: ["Badminton Courts", "Table Tennis", "Sports & Games Committee", "Cricket Ground", "Basketball Court"],
        summary: "Multipurpose sports complex housing indoor wooden badminton courts, table tennis, and expansive athletic grounds.",
        highlights: [
          { icon: "🏸", text: "Indoor Stadium for badminton tournaments, table tennis, carrom, and chess" },
          { icon: "⚽", text: "Outdoor sports grounds and courts for cricket, football, basketball, and volleyball" },
          { icon: "🏆", text: "Overseen by the GPREC Sports & Games Committee for intramural and inter-collegiate events" }
        ],
        keywords: ["sports", "stadium", "badminton", "table tennis", "cricket", "basketball", "volleyball", "grounds", "courts", "games"],
        queryPrompt: "What sports, indoor stadium, and playground facilities are available at GPREC?"
      },
      {
        id: "atm-health-amenities",
        name: "Health Centre, Union Bank & General Amenities",
        shortName: "Health Centre & Amenities",
        icon: "🏥",
        area: "Main Security Gate & Admin Annex",
        badge: "Campus Amenities",
        category: "amenities",
        nodeId: "node_main_gate",
        mapCoords: { x: 500, y: 660 },
        facilityTag: "Health Centre 9 AM – 5 PM • Union Bank",
        whatYouShouldKnow: "Comprehensive on-campus amenities including an exclusive Health Centre operating from 9:00 AM to 5:00 PM staffed by a qualified Medical Officer and 3 nursing staff for consultations, first aid, and medicines. Also features an on-campus Union Bank of India branch and ATM, Book Store for textbooks and stationery, copier and courier services, and RO purified drinking water.",
        amenityTags: ["Health Centre 9 AM – 5 PM", "Union Bank & ATM", "Campus Book Store", "Copier & Courier", "RO Purified Water"],
        summary: "Essential campus amenities including an exclusive Health Centre, on-campus Union Bank branch with ATM, bookstore, and courier services.",
        highlights: [
          { icon: "🏥", text: "Health Centre (9:00 AM – 5:00 PM): Staffed by a qualified Medical Officer and 3 nurses for medical care" },
          { icon: "🏦", text: "Banking Services: On-campus Union Bank of India branch and 24/7 ATM facility" },
          { icon: "📚", text: "Book Store & Services: Campus bookstore for textbooks, stationery, copier facilities, and courier support" }
        ],
        keywords: ["health centre", "clinic", "doctor", "medical", "first aid", "bank", "union bank", "atm", "book store", "stationery", "copier", "courier", "water"],
        queryPrompt: "What general amenities, health center, and bank facilities are available at GPREC?"
      }
    ]
  }
];

// Structured list of all campus locations for Start/End dropdowns
export const CAMPUS_LOCATIONS = [
  { id: "node_main_gate", facilityId: "node_main_gate", name: "Main Entrance Gate (Nandyal Rd)", shortName: "Main Gate", icon: "🚪" },
  { id: "node_csm_entry", facilityId: "csm-labs", name: "CSM Department (Intel AI Labs)", shortName: "CSM Department", icon: "💻" },
  { id: "node_auditorium_entry", facilityId: "auditorium", name: "Auditorium (AC Event Hall)", shortName: "Auditorium", icon: "🎭" },
  { id: "node_cie_entry", facilityId: "cie-hub", name: "CIE Innovation Hub", shortName: "CIE Hub", icon: "🚀" },
  { id: "node_library_entry", facilityId: "central-library", name: "Central Library & Digital Wing", shortName: "Central Library", icon: "📚" },
  { id: "node_food_court_entry", facilityId: "food-court", name: "Campus Food Court", shortName: "Food Court", icon: "🍔" },
  { id: "node_canteen_junction", facilityId: "cafeteria", name: "Main Canteen & Cafeteria", shortName: "Main Canteen", icon: "☕" },
  { id: "node_amphi_entry", facilityId: "amphitheatre", name: "Open Air Amphitheatre", shortName: "Amphitheatre", icon: "🎤" },
  { id: "node_cse_entry", facilityId: "cse-block", name: "CSE Department Block", shortName: "CSE Block", icon: "🖥️" },
  { id: "node_ece_entry", facilityId: "ece-eee-block", name: "ECE & EEE Department Block", shortName: "ECE/EEE Block", icon: "⚡" },
  { id: "node_mech_entry", facilityId: "mech-civil-block", name: "Mechanical & Civil Workshops", shortName: "Mech & Civil", icon: "🔧" },
  { id: "node_drone_entry", facilityId: "drone-robotics-lab", name: "Drone & Robotics Lab", shortName: "Drone Lab", icon: "🛸" },
  { id: "node_sports_entry", facilityId: "indoor-stadium", name: "Indoor Sports Stadium & Gym", shortName: "Sports Stadium", icon: "🏸" },
  { id: "node_gate_atm", facilityId: "atm-health-amenities", name: "24/7 ATM & Health Dispensary", shortName: "ATM & Clinic", icon: "🏥" }
];

// Helper to resolve any ID/string to a valid graph node ID
export function resolveToNodeId(target) {
  if (!target) return "node_main_gate";
  if (CAMPUS_NAV_NODES[target]) return target;

  const found = findFacilityAndZone(target);
  if (found?.facility?.nodeId) {
    return found.facility.nodeId;
  }
  return "node_main_gate";
}

// Generate friendly step-by-step route directions
function generateRouteSteps(path, startNodeId, destNodeId) {
  if (!path || path.length <= 1) return ["You are already at your destination."];

  const steps = [];
  const startName = CAMPUS_NAV_NODES[startNodeId]?.label || "Starting Point";
  const destName = CAMPUS_NAV_NODES[destNodeId]?.label || "Destination";

  steps.push(`Start from ${startName}`);

  for (let i = 1; i < path.length - 1; i++) {
    const currNode = CAMPUS_NAV_NODES[path[i]];
    if (currNode) {
      if (currNode.id === "node_quad_circle") {
        steps.push("Head through Central Quadrangle Roundabout (pass the garden lawn)");
      } else if (currNode.id === "node_central_avenue_mid") {
        steps.push("Follow tree-lined Central Avenue past the Food Plaza");
      } else if (currNode.id === "node_cie_entry") {
        steps.push("Walk along Innovation Way past CIE Innovation Hub");
      } else if (currNode.id === "node_gate_junction") {
        steps.push("Pass through Entrance Avenue Junction");
      } else if (currNode.id === "node_canteen_junction") {
        steps.push("Proceed past Main Cafeteria & Canteen Plaza");
      } else if (currNode.id === "node_library_entry") {
        steps.push("Pass along the Central Library walkway");
      } else if (currNode.id === "node_amphi_entry") {
        steps.push("Walk past the Open Air Amphitheatre");
      } else if (currNode.id === "node_cse_entry") {
        steps.push("Continue along the CSE Department corridor");
      } else if (currNode.id === "node_ece_entry") {
        steps.push("Pass along the ECE/EEE Block walkway");
      } else if (currNode.id === "node_mech_entry") {
        steps.push("Proceed past the Mechanical Workshops lane");
      } else {
        steps.push(`Continue via ${currNode.label}`);
      }
    }
  }

  steps.push(`Arrive at ${destName}`);
  return steps;
}

// =========================================================================
// 4. DIJKSTRA SHORTEST PATH ROUTING ALGORITHM
// =========================================================================
export function calculateCampusRoute(startId, destId) {
  const startNode = resolveToNodeId(startId);
  const destNode = resolveToNodeId(destId);

  if (!CAMPUS_NAV_NODES[startNode] || !CAMPUS_NAV_NODES[destNode]) {
    return {
      success: false,
      points: [],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      steps: ["Invalid route points"]
    };
  }

  if (startNode === destNode) {
    const node = CAMPUS_NAV_NODES[startNode];
    return {
      success: true,
      pathNodeIds: [startNode],
      points: [{ x: node.x, y: node.y }],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      steps: [`You are already at ${node.label}`]
    };
  }

  const distances = {};
  const prev = {};
  const unvisited = new Set(Object.keys(CAMPUS_NAV_NODES));

  for (const node of Object.keys(CAMPUS_NAV_NODES)) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minD) {
        minD = distances[node];
        curr = node;
      }
    }

    if (!curr || distances[curr] === Infinity) break;
    if (curr === destNode) break;

    unvisited.delete(curr);

    const neighbors = CAMPUS_NAV_GRAPH[curr] || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.target)) continue;
      const alt = distances[curr] + edge.dist;
      if (alt < distances[edge.target]) {
        distances[edge.target] = alt;
        prev[edge.target] = curr;
      }
    }
  }

  if (distances[destNode] === Infinity) {
    return {
      success: false,
      points: [],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      steps: ["No route available"]
    };
  }

  // Reconstruct path
  const path = [];
  let u = destNode;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  const points = path.map((nid) => ({
    x: CAMPUS_NAV_NODES[nid].x,
    y: CAMPUS_NAV_NODES[nid].y,
    id: nid,
    label: CAMPUS_NAV_NODES[nid].label
  }));

  const totalDistanceMeters = Math.round(distances[destNode]);
  // Average campus walking speed ~75 meters/min
  const estimatedMinutes = Math.max(1, Math.round(totalDistanceMeters / 75));
  const steps = generateRouteSteps(path, startNode, destNode);

  return {
    success: true,
    pathNodeIds: path,
    points,
    totalDistanceMeters,
    estimatedMinutes,
    steps
  };
}

// Deep search across name, category, keywords, summary, and tips
export function searchCampusGuide(query, activeCategory = "all") {
  const q = (query || "").toLowerCase().trim();
  const results = [];

  for (const zone of CAMPUS_ZONES) {
    for (const facility of zone.facilities) {
      if (activeCategory !== "all" && facility.category !== activeCategory) {
        if (
          !(activeCategory === "hackathon" && (facility.category === "hackathon" || facility.isHackathonHub)) &&
          !(activeCategory === "startups" && facility.category === "startups") &&
          !(activeCategory === "venues" && facility.category === "venues") &&
          !(activeCategory === "food" && facility.category === "food") &&
          !(activeCategory === "library" && facility.category === "library")
        ) {
          continue;
        }
      }

      if (!q) {
        results.push({ zone, facility });
        continue;
      }

      const matchName = facility.name.toLowerCase().includes(q) || facility.shortName.toLowerCase().includes(q);
      const matchArea = facility.area.toLowerCase().includes(q);
      const matchSummary = facility.summary.toLowerCase().includes(q);
      const matchTip = facility.whatYouShouldKnow && facility.whatYouShouldKnow.toLowerCase().includes(q);
      const matchKeywords = facility.keywords && facility.keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
      const matchHighlights = facility.highlights && facility.highlights.some((h) => h.text ? h.text.toLowerCase().includes(q) : String(h).toLowerCase().includes(q));

      if (matchName || matchArea || matchSummary || matchTip || matchKeywords || matchHighlights) {
        results.push({ zone, facility });
      }
    }
  }

  return results;
}

// Helper to find a facility and its parent zone
export function findFacilityAndZone(queryOrId) {
  if (!queryOrId) return null;
  const q = String(queryOrId).toLowerCase().trim();

  for (const zone of CAMPUS_ZONES) {
    if (zone.id === q || zone.name.toLowerCase().includes(q) || zone.shortName.toLowerCase().includes(q)) {
      return { zone, facility: zone.facilities[0] };
    }
    for (const facility of zone.facilities) {
      if (
        facility.id === q ||
        facility.nodeId === q ||
        facility.name.toLowerCase().includes(q) ||
        facility.shortName.toLowerCase().includes(q)
      ) {
        return { zone, facility };
      }
    }
  }

  // Fallback keyword matching
  for (const zone of CAMPUS_ZONES) {
    for (const facility of zone.facilities) {
      const match =
        q.includes(facility.id) ||
        (facility.id === "csm-labs" && (q.includes("csm") || q.includes("intel") || q.includes("hackathon") || q.includes("lab 6"))) ||
        (facility.id === "cie-hub" && (q.includes("cie") || q.includes("startup") || q.includes("incubation") || q.includes("coders club"))) ||
        (facility.id === "central-library" && (q.includes("library") || q.includes("book") || q.includes("slim 21") || q.includes("ieee"))) ||
        (facility.id === "cafeteria" && (q.includes("canteen") || q.includes("cafeteria") || q.includes("breakfast") || q.includes("dosa") || q.includes("thali"))) ||
        (facility.id === "food-court" && (q.includes("food court") || q.includes("juice") || q.includes("pizza") || q.includes("burger") || q.includes("shake"))) ||
        (facility.id === "auditorium" && (q.includes("auditorium") || q.includes("keynote") || q.includes("silver jubilee") || q.includes("ceremony") || q.includes("nihar"))) ||
        (facility.id === "amphitheatre" && (q.includes("amphi") || q.includes("amphitheatre") || q.includes("lawn") || q.includes("terrace"))) ||
        (facility.id === "drone-robotics-lab" && (q.includes("drone") || q.includes("robotics") || q.includes("uav"))) ||
        (facility.id === "indoor-stadium" && (q.includes("stadium") || q.includes("sports") || q.includes("gym") || q.includes("badminton"))) ||
        (facility.id === "atm-health-amenities" && (q.includes("atm") || q.includes("health") || q.includes("doctor") || q.includes("medical") || q.includes("gate") || q.includes("parking") || q.includes("water")));

      if (match) return { zone, facility };
    }
  }

  return null;
}
