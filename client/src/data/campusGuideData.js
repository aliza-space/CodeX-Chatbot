// Official visitor-focused GPREC campus data sourced from www.gprec.ac.in and Coders' Club GPREC

export const GPREC_INFO = {
  name: "G. Pulla Reddy Engineering College (Autonomous)",
  shortName: "GPREC Kurnool",
  established: "Est. 1984 • Autonomous • NAAC 'A+' & NBA Accredited",
  location: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, AP - 518007",
  gps: { lat: 15.8073, lng: 78.0375 },
  website: "https://www.gprec.ac.in",
  tagline: "Premier autonomous engineering campus & home of Coders' Club and CodeX Hackathons",
  visitorHighlight: "Spanning 30+ lush green acres with cutting-edge Intel AI labs, active startup incubators, modern food courts, and a vibrant tech community."
};

// =========================================================================
// 1. STRUCTURED CAMPUS NAVIGATION NODES & WAYPOINTS
// =========================================================================
export const CAMPUS_NAV_NODES = {
  node_main_gate: { id: "node_main_gate", x: 500, y: 660, label: "Main Entrance Gate (Nandyal Rd)", lat: 15.8073, lng: 78.0375 },
  node_gate_atm: { id: "node_gate_atm", x: 570, y: 640, label: "24/7 ATM & Health Dispensary", lat: 15.8074, lng: 78.0378 },
  node_gate_junction: { id: "node_gate_junction", x: 500, y: 590, label: "Entrance Avenue Junction", lat: 15.8076, lng: 78.0375 },
  node_auditorium_entry: { id: "node_auditorium_entry", x: 340, y: 560, label: "Silver Jubilee Auditorium Entrance", lat: 15.8078, lng: 78.0368 },
  node_central_avenue_mid: { id: "node_central_avenue_mid", x: 500, y: 470, label: "Central Avenue & Food Plaza Cross", lat: 15.8082, lng: 78.0375 },
  node_canteen_junction: { id: "node_canteen_junction", x: 380, y: 470, label: "Main Cafeteria & Canteen Plaza", lat: 15.8082, lng: 78.0370 },
  node_food_court_entry: { id: "node_food_court_entry", x: 580, y: 480, label: "Campus Food Court & Canopy Seating", lat: 15.8082, lng: 78.0380 },
  node_quad_circle: { id: "node_quad_circle", x: 500, y: 360, label: "Central Quadrangle Roundabout", lat: 15.8088, lng: 78.0375 },
  node_library_entry: { id: "node_library_entry", x: 380, y: 310, label: "Central Library & Digital Wing", lat: 15.8091, lng: 78.0369 },
  node_cie_entry: { id: "node_cie_entry", x: 640, y: 420, label: "Coders' Club & CIE Innovation Hub", lat: 15.8085, lng: 78.0383 },
  node_csm_entry: { id: "node_csm_entry", x: 720, y: 370, label: "CSM Block (Intel AI/ML Hub - 2nd Fl)", lat: 15.8088, lng: 78.0388 },
  node_drone_entry: { id: "node_drone_entry", x: 770, y: 460, label: "Drone & Robotics Research Lab", lat: 15.8084, lng: 78.0392 },
  node_amphi_entry: { id: "node_amphi_entry", x: 600, y: 280, label: "Open Air Amphitheatre (\"Amphi\")", lat: 15.8093, lng: 78.0382 },
  node_cse_entry: { id: "node_cse_entry", x: 710, y: 220, label: "CSE Department Block", lat: 15.8096, lng: 78.0388 },
  node_ece_entry: { id: "node_ece_entry", x: 520, y: 180, label: "ECE & EEE Department Block", lat: 15.8098, lng: 78.0376 },
  node_mech_entry: { id: "node_mech_entry", x: 280, y: 190, label: "Mechanical & Civil Workshops", lat: 15.8097, lng: 78.0363 },
  node_sports_entry: { id: "node_sports_entry", x: 800, y: 160, label: "Indoor Sports Stadium & Grounds", lat: 15.8099, lng: 78.0395 }
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
    { target: "node_central_avenue_mid", dist: 110 }
  ],
  node_auditorium_entry: [
    { target: "node_gate_junction", dist: 80 },
    { target: "node_canteen_junction", dist: 90 }
  ],
  node_central_avenue_mid: [
    { target: "node_gate_junction", dist: 110 },
    { target: "node_canteen_junction", dist: 70 },
    { target: "node_food_court_entry", dist: 60 },
    { target: "node_quad_circle", dist: 100 }
  ],
  node_canteen_junction: [
    { target: "node_central_avenue_mid", dist: 70 },
    { target: "node_auditorium_entry", dist: 90 },
    { target: "node_library_entry", dist: 120 }
  ],
  node_food_court_entry: [
    { target: "node_central_avenue_mid", dist: 60 },
    { target: "node_cie_entry", dist: 80 }
  ],
  node_quad_circle: [
    { target: "node_central_avenue_mid", dist: 100 },
    { target: "node_library_entry", dist: 85 },
    { target: "node_cie_entry", dist: 110 },
    { target: "node_amphi_entry", dist: 95 },
    { target: "node_ece_entry", dist: 130 }
  ],
  node_library_entry: [
    { target: "node_quad_circle", dist: 85 },
    { target: "node_canteen_junction", dist: 120 },
    { target: "node_mech_entry", dist: 110 }
  ],
  node_cie_entry: [
    { target: "node_food_court_entry", dist: 80 },
    { target: "node_quad_circle", dist: 110 },
    { target: "node_csm_entry", dist: 70 },
    { target: "node_drone_entry", dist: 75 }
  ],
  node_csm_entry: [
    { target: "node_cie_entry", dist: 70 },
    { target: "node_drone_entry", dist: 60 },
    { target: "node_amphi_entry", dist: 85 },
    { target: "node_cse_entry", dist: 110 }
  ],
  node_drone_entry: [
    { target: "node_cie_entry", dist: 75 },
    { target: "node_csm_entry", dist: 60 }
  ],
  node_amphi_entry: [
    { target: "node_quad_circle", dist: 95 },
    { target: "node_csm_entry", dist: 85 },
    { target: "node_cse_entry", dist: 90 }
  ],
  node_cse_entry: [
    { target: "node_csm_entry", dist: 110 },
    { target: "node_amphi_entry", dist: 90 },
    { target: "node_sports_entry", dist: 90 },
    { target: "node_ece_entry", dist: 120 }
  ],
  node_ece_entry: [
    { target: "node_quad_circle", dist: 130 },
    { target: "node_cse_entry", dist: 120 },
    { target: "node_mech_entry", dist: 130 }
  ],
  node_mech_entry: [
    { target: "node_library_entry", dist: 110 },
    { target: "node_ece_entry", dist: 130 }
  ],
  node_sports_entry: [
    { target: "node_cse_entry", dist: 90 }
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
    { id: "south-junction", d: "M 340 560 L 500 590 L 570 640", width: 20 },
    { id: "canteen-cross", d: "M 380 470 L 580 480", width: 18, label: "Food Plaza Walkway" },
    { id: "quad-ring", d: "M 500 360 m -45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0", width: 22 },
    { id: "east-wing", d: "M 500 360 L 640 420 L 720 370 L 770 460", width: 18, label: "Innovation Way" },
    { id: "north-east-path", d: "M 720 370 L 710 220 L 800 160", width: 16 },
    { id: "amphi-connector", d: "M 500 360 L 600 280 L 710 220", width: 16 },
    { id: "north-wing", d: "M 500 360 L 520 180 L 710 220", width: 16 },
    { id: "west-wing", d: "M 500 360 L 380 310 L 280 190 L 520 180", width: 18, label: "Academic West Lane" },
    { id: "canteen-library-link", d: "M 380 470 L 380 310", width: 16 }
  ],
  greenery: [
    { id: "lawn-quad", cx: 500, cy: 360, r: 35, label: "Central Garden" },
    { id: "lawn-east", x: 570, y: 310, w: 90, h: 80, rx: 12, label: "East Lawn" },
    { id: "lawn-canteen", x: 420, y: 490, w: 70, h: 60, rx: 10 },
    { id: "sports-ground", x: 740, y: 220, w: 160, h: 100, rx: 16, label: "Athletic Ground" }
  ],
  buildings: [
    {
      id: "csm-block",
      name: "CSM Block (Intel AI/ML Hub)",
      code: "CSM",
      x: 690,
      y: 330,
      w: 120,
      h: 90,
      zone: "academic-zone",
      category: "hackathon",
      color: "blue",
      markerId: "csm-labs",
      nodeId: "node_csm_entry"
    },
    {
      id: "cie-hub",
      name: "Coders' Club & CIE Center",
      code: "CIE",
      x: 610,
      y: 400,
      w: 90,
      h: 60,
      zone: "academic-zone",
      category: "startups",
      color: "indigo",
      markerId: "coders-club-cie",
      nodeId: "node_cie_entry"
    },
    {
      id: "drone-lab",
      name: "Drone & Robotics Lab",
      code: "DRONE",
      x: 740,
      y: 430,
      w: 80,
      h: 55,
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
      x: 660,
      y: 160,
      w: 110,
      h: 80,
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
      x: 460,
      y: 120,
      w: 120,
      h: 75,
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
      x: 210,
      y: 130,
      w: 130,
      h: 90,
      zone: "academic-zone",
      category: "startups",
      color: "orange",
      markerId: "mech-civil-block",
      nodeId: "node_mech_entry"
    },
    {
      id: "auditorium-building",
      name: "Silver Jubilee Auditorium",
      code: "AUDITORIUM",
      x: 250,
      y: 520,
      w: 130,
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
      x: 300,
      y: 260,
      w: 120,
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
      x: 570,
      y: 250,
      w: 80,
      h: 60,
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
      x: 300,
      y: 430,
      w: 110,
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
      x: 550,
      y: 450,
      w: 90,
      h: 60,
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
      x: 770,
      y: 110,
      w: 95,
      h: 65,
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
    subtitle: "Department blocks, Intel AI labs, Coders' Club hub & innovation centres",
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
        mapCoords: { x: 720, y: 370 },
        isHackathonHub: true,
        liveStatus: {
          badge: "Workstations: 14/20 Free",
          state: "active",
          text: "Labs 1–6 Online • 1 Gbps Fiber • 100% UPS Active"
        },
        whatYouShouldKnow: "Primary arena for CodeX hackathon rounds (2nd floor Lab 6). High-speed Lenovo ThinkCentre Neo 50S (i5 12th Gen, 16GB RAM) workstations, ultra-low latency 1 Gbps fiber internet, dual-port power per bench, and round-the-clock technical mentor desk.",
        techSpecs: {
          workstations: "240+ High-Performance PCs across Labs 1-8",
          processors: "Intel Core i5 12th Gen / 16GB DDR4 / 512GB NVMe",
          network: "1 Gbps Redundant Dual-Band Fiber Wi-Fi",
          powerBackup: "100% Online UPS + Dedicated Heavy Diesel Gensets",
          support: "Coders' Club Volunteer Mentors on 24/7 duty"
        },
        summary: "State-of-the-art Intel Unnati AI/ML Center (CSM Lab 6), Drone & Robotics Lab, Python, and high-performance computing suites.",
        highlights: [
          "2nd Floor Lab 6: Intel Unnati AI/ML Center with high-end Lenovo workstations for Deep Learning & Generative AI",
          "Ground Floor: Core Programming Labs 1 & 2 and specialized Drone & Robotics Research Lab",
          "1st Floor: Advanced Software, DBMS & Web Labs 3–5 plus multimedia tutorial seminar halls",
          "Equipped with dedicated power backup for 24-hour non-stop hackathons"
        ],
        keywords: ["csm", "intel", "ai", "ml", "hackathon", "workstation", "pc", "computer", "lab", "lab 6", "wifi", "internet", "power", "charging", "mentor", "code", "programming", "python", "gpu"],
        queryPrompt: "Tell me about CSM Computer Labs and the Intel AI/ML Lab at GPREC"
      },
      {
        id: "coders-club-cie",
        name: "Coders' Club & CIE Innovation Hub",
        shortName: "Coders' Club & CIE",
        icon: "🚀",
        area: "Ground Floor, Central Academic Wing",
        badge: "Community & Startups",
        category: "startups",
        nodeId: "node_cie_entry",
        mapCoords: { x: 640, y: 420 },
        liveStatus: {
          badge: "CIE Incubator: Open",
          state: "active",
          text: "Mentors on duty • Hackathon Helpdesk Active"
        },
        whatYouShouldKnow: "The epicenter of GPREC student coding and startup culture. Home to the Coders' Club executive coordinators and the Centre for Innovation & Entrepreneurship (CIE). Visit for event registration queries, hardware components, mentor consultation, and seed funding support.",
        techSpecs: {
          mentorship: "Student Coordinators & Faculty Leads available",
          facilities: "Prototyping benches, high-speed Wi-Fi, 3D printers, whiteboard brainstorm rooms",
          activities: "CodeX Hackathons, IdeaSprint, Bootcamps, Algorithm contests",
          hours: "8:30 AM – 8:00 PM (24/7 during CodeX events)"
        },
        summary: "The heartbeat of GPREC's programming culture — organizing CodeX, IdeaSprint, competitive coding bootcamps, and student-led startup incubation.",
        highlights: [
          "Headquarters of Coders' Club GPREC — student coordinators, mentors & technical leads",
          "Centre for Innovation & Entrepreneurship (CIE): Incubation support for tech prototypes and student startups",
          "Regular meetup hub for algorithm prep, project hackathons, and industry mentorship"
        ],
        keywords: ["cie", "coders club", "startup", "incubation", "entrepreneurship", "mentor", "helpdesk", "registration", "organizer", "team", "whiteboard", "prototype", "funding", "ideasprint"],
        queryPrompt: "Tell me about Coders' Club and the CIE Innovation Center at GPREC"
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
        mapCoords: { x: 710, y: 220 },
        liveStatus: {
          badge: "Cloud Labs: Open",
          state: "active",
          text: "Lecture theatres & networking suites operational"
        },
        whatYouShouldKnow: "Core computing department with smart lecture halls and cloud computing testbeds. Features Linux terminal stations, network simulation rigs, and faculty consultation chambers for external participants.",
        techSpecs: {
          labs: "Networking Labs, Cloud Computing Suites, OS & Compiler Lab",
          displays: "Interactive 4K Smart Interactive Panels in lecture theatres",
          capacity: "Tiered seating for 120+ students per lecture hall"
        },
        summary: "Core CSE lecture theatres, advanced networking suites, cloud labs, and faculty research chambers.",
        highlights: [
          "Spacious tiered lecture halls equipped with digital smart boards and projectors",
          "Specialized networking, operating systems, and distributed systems laboratories"
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
        mapCoords: { x: 520, y: 180 },
        liveStatus: {
          badge: "IoT Workbench: Active",
          state: "active",
          text: "Microcontrollers & sensor kits available"
        },
        whatYouShouldKnow: "Hardware prototyping hub for electronics and electrical engineering. Features Raspberry Pi, Arduino, ESP32 development kits, VLSI testing, and high-voltage electrical machinery labs.",
        techSpecs: {
          hardware: "ESP32, Raspberry Pi 4, Arduino, FPGA kits, Digital Storage Oscilloscopes",
          labs: "VLSI Design, Embedded Systems, DSP & IoT Lab, Power Electronics",
          workbench: "Soldering stations and component stockroom"
        },
        summary: "Electronics & Communication and Electrical engineering hubs housing advanced microprocessors, DSP, and renewable energy testbeds.",
        highlights: [
          "Microprocessor, embedded systems, and VLSI circuit prototyping labs",
          "High-voltage electrical machinery and power systems research suites"
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
        mapCoords: { x: 770, y: 460 },
        liveStatus: {
          badge: "Telemetry: Standby",
          state: "active",
          text: "Flight arena available for sensor calibration"
        },
        whatYouShouldKnow: "Ground floor CSM block facility dedicated to autonomous quadcopters, fixed-wing UAVs, computer vision obstacle avoidance, and ROS (Robot Operating System) robotics.",
        techSpecs: {
          equipment: "Custom carbon-fiber quadcopters, LIDAR sensors, stereo vision cameras, 3D printers",
          software: "ROS 2, PX4 Autopilot, OpenCV, Gazebo Simulation",
          testing: "Enclosed net testing arena for flight calibration"
        },
        summary: "Specialized laboratory for unmanned aerial vehicles (UAVs), computer vision navigation, and IoT sensor integration.",
        highlights: [
          "Dedicated hardware assembly benches and drone flight testing arena",
          "Autonomous navigation and obstacle-detection algorithms powered by AI edge devices"
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
        mapCoords: { x: 280, y: 190 },
        liveStatus: {
          badge: "Workshops: Open",
          state: "active",
          text: "CNC machining & 3D prototyping station available"
        },
        whatYouShouldKnow: "Central workshops housing heavy mechanical machinery, CNC milling, lathe equipment, structural engineering rigs, and 3D printing manufacturing units.",
        techSpecs: {
          machinery: "CNC Milling Centers, Industrial Lathes, Universal Testing Machine (UTM)",
          cadcam: "AutoCAD, SolidWorks, ANSYS finite element workstations",
          safety: "PPE / protective goggles required in heavy machining bays"
        },
        summary: "Central mechanical engineering workshops, 3D design centers, concrete testing, and fluid dynamics testing rigs.",
        highlights: [
          "CNC machining centers, 3D printing facilities, and automated welding workshops",
          "Civil structural analysis, soil mechanics, and hydraulics labs"
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
    subtitle: "Silver Jubilee Auditorium, Amphitheatre, Food Court, Canteen & Library",
    icon: "🌟",
    badge: "Zone 2",
    themeColor: "emerald",
    overview: "Key gathering venues, dining hotspots, sports arenas, and visitor conveniences at GPREC.",
    facilities: [
      {
        id: "auditorium",
        name: "Silver Jubilee Auditorium",
        shortName: "Auditorium",
        icon: "🎭",
        area: "Near Main Campus Entrance Gate",
        badge: "Keynotes & Ceremonies",
        category: "venues",
        nodeId: "node_auditorium_entry",
        mapCoords: { x: 340, y: 560 },
        liveStatus: {
          badge: "Seating: 1,000+ Ready",
          state: "active",
          text: "Acoustic line-array & 4K dual projection online"
        },
        whatYouShouldKnow: "Grand air-conditioned auditorium situated right near the Main Gate. Official venue for CodeX 4.0 opening ceremony, guest keynotes (Dodagatta Nihar), and university awards. Features Bose line-array audio, motorized projection, and executive VIP lounge.",
        amenityTags: ["1,000+ Seats", "Full Air-Conditioned", "Bose Audio", "Dual 4K Projectors", "VIP Green Rooms"],
        summary: "Acoustically engineered grand indoor auditorium with Bose audio systems, dual high-lumen projectors, and VIP executive suites.",
        highlights: [
          "Capacity for 1,000+ attendees for inaugural sessions, symposia, and cultural fests",
          "Host venue for keynote speaker Dodagatta Nihar and national technical conferences",
          "Just a 1-minute walk from the Main Entrance Security Gate"
        ],
        keywords: ["auditorium", "silver jubilee", "keynote", "ceremony", "inauguration", "speaker", "nihar", "hall", "ac", "seating", "stage", "sound", "projector"],
        queryPrompt: "Tell me about the Silver Jubilee Auditorium at GPREC"
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
        mapCoords: { x: 600, y: 280 },
        liveStatus: {
          badge: "Lawn Vibes: Open",
          state: "active",
          text: "Social break & music jam arena"
        },
        whatYouShouldKnow: "GPREC's favorite outdoor social hangout. Tiered semi-circular stone steps under shady trees, perfect for evening guitar jams, team mixers, pitch dry-runs, and hackathon fresh-air breaks.",
        amenityTags: ["800+ Tiered Seating", "Open-Air Lawn", "Acoustic Courtyard", "Evening Lighting", "Tree Shaded"],
        summary: "Tiered semi-circular stone terrace arena accommodating 800+ students for cultural fests, club meetups, and open-air ceremonies.",
        highlights: [
          "Premier social gathering arena surrounded by lush green lawns and shade trees",
          "Popular spot for hackathon break sessions, project showcases, and team networking"
        ],
        keywords: ["amphi", "amphitheatre", "open air", "lawn", "stage", "cultural", "fest", "mixer", "social", "evening", "seating", "steps", "jam"],
        queryPrompt: "Tell me about the Open Air Amphitheatre at GPREC"
      },
      {
        id: "food-court",
        name: "Campus Food Court",
        shortName: "Food Court",
        icon: "🥤",
        area: "Central Amenities Plaza",
        badge: "Hangout & Wi-Fi",
        category: "food",
        nodeId: "node_food_court_entry",
        mapCoords: { x: 580, y: 480 },
        liveStatus: {
          badge: "Food Court: Open",
          state: "active",
          text: "Pizzas, shakes, snacks & campus Wi-Fi online"
        },
        whatYouShouldKnow: "Vibrant open-air food plaza with covered outdoor canopy tables and full campus Wi-Fi coverage. Serves hot grilled sandwiches, pizzas, veg burgers, noodles, momos, thick shakes, fresh fruit juices, and ice creams.",
        amenityTags: ["Fast Food & Snacks", "Juice & Dessert Bar", "Outdoor Canopy Seating", "Campus Wi-Fi", "Open 9 AM – 6:30 PM"],
        summary: "Vibrant open-air lifestyle dining space with outdoor tables — prime spot for hackathon teams to recharge between sprints.",
        highlights: [
          "Quick bites menu: Grilled sandwiches, burgers, noodles, rolls, and chaat",
          "Juice & dessert bar: Fresh fruit juices, cold coffee, thick milkshakes, and ice creams",
          "Open 9:00 AM – 6:30 PM (extended during hackathons and college fests)"
        ],
        keywords: ["food court", "food", "snacks", "pizza", "burger", "sandwich", "juice", "shake", "ice cream", "coffee", "wifi", "tables", "eating", "dining"],
        queryPrompt: "What food and snack options are available in GPREC Food Court?"
      },
      {
        id: "cafeteria",
        name: "Main Cafeteria & College Canteen",
        shortName: "Main Canteen",
        icon: "🍴",
        area: "South-East Dining Block",
        badge: "Breakfast & Lunch",
        category: "food",
        nodeId: "node_canteen_junction",
        mapCoords: { x: 380, y: 470 },
        liveStatus: {
          badge: "Canteen: Active",
          state: "active",
          text: "Fresh tiffins, vegetarian thalis & filter coffee"
        },
        whatYouShouldKnow: "Large institutional dining hall serving authentic South Indian breakfast (crispy dosas, idli-vada, poori, upma), full vegetarian lunch thalis, and filter coffee at subsidised student-friendly pricing under Canteen Committee hygiene supervision.",
        amenityTags: ["Breakfast: 8:30 – 11:30 AM", "Lunch: 12:00 – 2:30 PM", "Subsidised Rates", "Filter Coffee & Tea", "Indoor Seating"],
        summary: "Hygiene-monitored institutional cafeteria serving fresh breakfast, lunch, and evening snacks supervised by the GPREC Canteen Committee.",
        highlights: [
          "Breakfast (8:30 AM – 11:30 AM): Crispy dosas, idli-vada, poori, and filter coffee",
          "Lunch Meals (12:00 PM – 2:30 PM): Vegetarian thalis, sambar rice, curd rice, and variety rice",
          "Clean dining hall with ample seating and student-friendly pricing"
        ],
        keywords: ["canteen", "cafeteria", "breakfast", "lunch", "dosa", "idli", "thali", "meals", "coffee", "tea", "subsidised", "hygiene", "food", "dining"],
        queryPrompt: "What are the GPREC Canteen breakfast and lunch timings?"
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
        mapCoords: { x: 380, y: 310 },
        liveStatus: {
          badge: "Reading Room: 42/150",
          state: "active",
          text: "IEEE Xplore terminals & quiet zones open"
        },
        whatYouShouldKnow: "Automated SLIM 21 library with 66,000+ volumes, 150+ seat air-conditioned reading halls, and high-speed Digital Library workstations with IEEE Xplore, ScienceDirect, and NPTEL access. Quietest place on campus to debug or read research papers.",
        amenityTags: ["66,000+ Volumes", "IEEE Digital Wing", "150+ Seats", "Quiet Study Hall", "Open 9 AM – 7 PM"],
        summary: "Fully automated with SLIM 21 library management software, offering 66,106+ volumes, 14,153 titles, and 150+ seat reading spaces.",
        highlights: [
          "Digital Library wing with 12 high-speed workstations with IEEE Xplore, ScienceDirect, and NPTEL access",
          "Extensive collection of engineering, AI, data science, algorithms, and competitive exam books",
          "Reprography, quiet study zones, and reference archives"
        ],
        keywords: ["library", "books", "ieee", "research", "digital", "quiet", "study", "reading", "slim 21", "journals", "photocopy", "print", "nptel"],
        queryPrompt: "Tell me about the Central Library facilities and timings at GPREC"
      },
      {
        id: "indoor-stadium",
        name: "Indoor Sports Stadium & Grounds",
        shortName: "Indoor Stadium & Gym",
        icon: "🏟️",
        area: "North-East Campus Perimeter",
        badge: "Sports & Fitness",
        category: "venues",
        nodeId: "node_sports_entry",
        mapCoords: { x: 800, y: 160 },
        liveStatus: {
          badge: "Courts: Available",
          state: "active",
          text: "Wooden badminton courts & cardio gym open"
        },
        whatYouShouldKnow: "Spacious sports arena featuring tournament-grade wooden badminton courts, table tennis, cardio & strength gym equipment, and expansive grounds for cricket and basketball.",
        amenityTags: ["Badminton Courts", "Table Tennis", "Fitness Gym", "Cricket Ground", "Basketball Court"],
        summary: "Multipurpose sports complex housing indoor wooden badminton courts, table tennis, fitness gym, and expansive athletic grounds.",
        highlights: [
          "Indoor stadium for badminton, table tennis, carrom, and chess",
          "Equipped fitness gymnasium and outdoor grounds for cricket and basketball"
        ],
        keywords: ["sports", "stadium", "badminton", "table tennis", "gym", "fitness", "cricket", "basketball", "workout", "cardio", "courts"],
        queryPrompt: "What sports and gym facilities are available at GPREC?"
      },
      {
        id: "atm-health-amenities",
        name: "Main Gate Amenities, 24/7 ATM & Health Clinic",
        shortName: "Gate, ATM & Health Clinic",
        icon: "🏥",
        area: "Main Security Gate & Admin Annex",
        badge: "Visitor Amenities",
        category: "amenities",
        nodeId: "node_main_gate",
        mapCoords: { x: 500, y: 660 },
        liveStatus: {
          badge: "ATM & Clinic: 24/7",
          state: "active",
          text: "Canara/SBI ATMs online • First aid nurse on duty"
        },
        whatYouShouldKnow: "Essential visitor services located immediately inside the Main Entrance Gate. Features 24/7 Canara Bank and SBI cash ATMs, campus medical clinic providing free first aid and medicines, RO chilled drinking water, and dedicated visitor parking.",
        amenityTags: ["24/7 Cash ATMs", "Emergency Dispensary", "RO Chilled Water", "Visitor Parking", "Security Helpdesk"],
        summary: "Essential conveniences located right at the campus entrance for visiting students, participants, and parents.",
        highlights: [
          "24/7 Cash ATMs (Canara Bank & SBI) located right inside the Main Security Gate",
          "Campus Health Centre & Dispensary providing free emergency consultations and medicines",
          "RO chilled drinking water dispensers installed on all academic floors"
        ],
        keywords: ["atm", "cash", "bank", "canara", "sbi", "health", "clinic", "doctor", "first aid", "emergency", "medicine", "water", "ro", "parking", "security", "gate"],
        queryPrompt: "Where is the ATM and health center on GPREC campus?"
      }
    ]
  }
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
        steps.push("Reach Central Quadrangle Roundabout (pass the garden lawn)");
      } else if (currNode.id === "node_central_avenue_mid") {
        steps.push("Follow tree-lined Central Avenue past the Food Plaza");
      } else if (currNode.id === "node_cie_entry") {
        steps.push("Turn along Innovation Way past Coders' Club & CIE Hub");
      } else if (currNode.id === "node_gate_junction") {
        steps.push("Head North from Main Security checkpoint");
      } else {
        steps.push(`Continue through ${currNode.label}`);
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
      // Category filter check
      if (activeCategory !== "all" && facility.category !== activeCategory) {
        // Also allow matching if activeCategory matches keyword in id or category
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
      const matchHighlights = facility.highlights && facility.highlights.some((h) => h.toLowerCase().includes(q));

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
        (facility.id === "coders-club-cie" && (q.includes("coders club") || q.includes("cie") || q.includes("startup") || q.includes("incubation") || q.includes("club"))) ||
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
