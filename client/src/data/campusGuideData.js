// Official visitor-focused GPREC campus data sourced from www.gprec.ac.in and Coders' Club GPREC

export const GPREC_INFO = {
  name: "G. Pulla Reddy Engineering College (Autonomous)",
  shortName: "GPREC Kurnool",
  established: "Est. 1984 • Autonomous • NAAC 'A+' & NBA Accredited",
  location: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, AP - 518007",
  website: "https://www.gprec.ac.in",
  tagline: "Premier autonomous engineering campus & home of Coders' Club and CodeX Hackathons",
  visitorHighlight: "Spanning 30+ lush green acres with cutting-edge Intel AI labs, active startup incubators, modern food courts, and a vibrant tech community."
};

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
        isHackathonHub: true,
        visitorTip: "The primary battleground for CodeX hackathon rounds — high-speed workstations, 1 Gbps fiber internet, and 100% UPS backup.",
        summary: "State-of-the-art Intel Unnati AI/ML Center (CSM Lab 6), Drone & Robotics Lab, Python, and high-performance computing suites.",
        highlights: [
          "2nd Floor Lab 6: Intel Unnati AI/ML Center with Lenovo ThinkCentre Neo 50S (i5 12th Gen, 16GB RAM) — primary arena for CodeX 4.0",
          "Ground Floor: Core Programming Labs 1 & 2 and specialized Drone & Robotics Research Lab",
          "1st Floor: Advanced Software, DBMS & Web Labs 3–5 plus multimedia tutorial seminar halls",
          "Equipped with 1 Gbps dual-band Wi-Fi and 24/7 dedicated generator power backup"
        ],
        queryPrompt: "Tell me about CSM Computer Labs and the Intel AI/ML Lab at GPREC"
      },
      {
        id: "coders-club-cie",
        name: "Coders' Club & CIE Innovation Hub",
        shortName: "Coders' Club & CIE",
        icon: "🚀",
        area: "Ground Floor, Central Academic Wing",
        badge: "Community & Startups",
        visitorTip: "Connect with CodeX organizers, student mentors, and startup founders from GPREC's Centre for Innovation and Entrepreneurship (CIE).",
        summary: "The heartbeat of GPREC's programming culture — organizing CodeX, IdeaSprint, competitive coding bootcamps, and student-led startup incubation.",
        highlights: [
          "Headquarters of Coders' Club GPREC — student coordinators, mentors & technical leads",
          "Centre for Innovation & Entrepreneurship (CIE): Incubation support for tech prototypes and student startups",
          "Regular meetup hub for algorithm prep, project hackathons, and industry mentorship"
        ],
        queryPrompt: "Tell me about Coders' Club and the CIE Innovation Center at GPREC"
      },
      {
        id: "cse-block",
        name: "Computer Science & Engineering (CSE) Block",
        shortName: "CSE Block",
        icon: "🖥️",
        area: "Central-East Academic Wing • Ground to 2nd Floor",
        badge: "Computing Core",
        visitorTip: "Home to GPREC's pioneer computing department with specialized cloud computing, networking, and software testing labs.",
        summary: "Core CSE lecture theatres, advanced networking suites, cloud labs, and faculty research chambers.",
        highlights: [
          "Spacious tiered lecture halls equipped with digital smart boards and projectors",
          "Specialized networking, operating systems, and distributed systems laboratories"
        ],
        queryPrompt: "Tell me about the CSE Department Block at GPREC"
      },
      {
        id: "ece-eee-block",
        name: "ECE & EEE Department Block",
        shortName: "ECE / EEE Block",
        icon: "⚡",
        area: "North-East Academic Wing • Ground to 3rd Floor",
        badge: "Hardware & IoT",
        visitorTip: "Explore IoT prototyping, VLSI design, robotics, and electrical machine testing labs.",
        summary: "Electronics & Communication and Electrical engineering hubs housing advanced microprocessors, DSP, and renewable energy testbeds.",
        highlights: [
          "Microprocessor, embedded systems, and VLSI circuit prototyping labs",
          "High-voltage electrical machinery and power systems research suites"
        ],
        queryPrompt: "Tell me about the ECE and EEE Department at GPREC"
      },
      {
        id: "drone-robotics-lab",
        name: "Drone & Robotics Research Lab",
        shortName: "Drone & Robotics Lab",
        icon: "🤖",
        area: "Ground Floor, CSM Academic Block",
        badge: "Robotics & UAVs",
        visitorTip: "Witness student-built autonomous drones, UAV flight telemetry systems, and sensor-driven robotics.",
        summary: "Specialized laboratory for unmanned aerial vehicles (UAVs), computer vision navigation, and IoT sensor integration.",
        highlights: [
          "Dedicated hardware assembly benches and drone flight testing arena",
          "Autonomous navigation and obstacle-detection algorithms powered by AI edge devices"
        ],
        queryPrompt: "Tell me about the Drone and Robotics Lab at GPREC"
      },
      {
        id: "mech-civil-block",
        name: "Mechanical & Civil Block & Central Workshops",
        shortName: "Mech & Civil Block",
        icon: "⚙️",
        area: "South-West Academic Wing • Ground to 2nd Floor",
        badge: "Design & Manufacturing",
        visitorTip: "Houses heavy machinery, CAD/CAM prototyping centers, CNC machining, and structural mechanics labs.",
        summary: "Central mechanical engineering workshops, 3D design centers, concrete testing, and fluid dynamics testing rigs.",
        highlights: [
          "CNC machining centers, 3D printing facilities, and automated welding workshops",
          "Civil structural analysis, soil mechanics, and hydraulics labs"
        ],
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
        visitorTip: "1,000+ seat air-conditioned arena right near the main gate — official venue for CodeX 4.0 opening ceremony & guest keynotes.",
        summary: "Acoustically engineered grand indoor auditorium with Bose audio systems, dual high-lumen projectors, and VIP executive suites.",
        highlights: [
          "Capacity for 1,000+ attendees for inaugural sessions, symposia, and cultural fests",
          "Host venue for keynote speaker Dodagatta Nihar and national technical conferences",
          "Just a 1-minute walk from the Main Entrance Security Gate"
        ],
        queryPrompt: "Tell me about the Silver Jubilee Auditorium at GPREC"
      },
      {
        id: "amphitheatre",
        name: "Open Air Amphitheatre (\"Amphi\")",
        shortName: "Open Air Amphitheatre",
        icon: "🎤",
        area: "Central Lawn • Next to CSM Quadrangle",
        badge: "Social & Cultural Hub",
        visitorTip: "GPREC's favorite outdoor hangout — stone terrace steps under the trees, perfect for evening music jams and hackathon mixers.",
        summary: "Tiered semi-circular stone terrace arena accommodating 800+ students for cultural fests, club meetups, and open-air ceremonies.",
        highlights: [
          "Premier social gathering arena surrounded by lush green lawns and shade trees",
          "Popular spot for hackathon break sessions, project showcases, and team networking"
        ],
        queryPrompt: "Tell me about the Open Air Amphitheatre at GPREC"
      },
      {
        id: "food-court",
        name: "Campus Food Court",
        shortName: "Food Court",
        icon: "🥤",
        area: "Central Amenities Plaza",
        badge: "Hangout & Wi-Fi",
        visitorTip: "Grab quick pizzas, burgers, sandwiches, shakes, and ice creams under shaded canopies with high-speed campus Wi-Fi.",
        summary: "Vibrant open-air lifestyle dining space with outdoor tables — prime spot for hackathon teams to recharge between sprints.",
        highlights: [
          "Quick bites menu: Grilled sandwiches, burgers, noodles, rolls, and chaat",
          "Juice & dessert bar: Fresh fruit juices, cold coffee, thick milkshakes, and ice creams",
          "Open 9:00 AM – 6:30 PM (extended during hackathons and college fests)"
        ],
        queryPrompt: "What food and snack options are available in GPREC Food Court?"
      },
      {
        id: "cafeteria",
        name: "Main Cafeteria & College Canteen",
        shortName: "Main Canteen",
        icon: "🍴",
        area: "South-East Dining Block",
        badge: "Breakfast & Lunch",
        visitorTip: "Get authentic South Indian breakfast (dosa, idli, upma), full vegetarian lunch thalis, and filter coffee at subsidised rates.",
        summary: "Hygiene-monitored institutional cafeteria serving fresh breakfast, lunch, and evening snacks supervised by the GPREC Canteen Committee.",
        highlights: [
          "Breakfast (8:30 AM – 11:30 AM): Crispy dosas, idli-vada, poori, and filter coffee",
          "Lunch Meals (12:00 PM – 2:30 PM): Vegetarian thalis, sambar rice, curd rice, and variety rice",
          "Clean dining hall with ample seating and student-friendly pricing"
        ],
        queryPrompt: "What are the GPREC Canteen breakfast and lunch timings?"
      },
      {
        id: "central-library",
        name: "Central Library & Digital Wing",
        shortName: "Central Library",
        icon: "📚",
        area: "Central Academic Quadrangle",
        badge: "Digital Research",
        visitorTip: "Fully air-conditioned reading halls, 66,000+ volumes, and a high-speed digital research lab with IEEE access. Open 9 AM – 7 PM.",
        summary: "Fully automated with SLIM 21 library management software, offering 66,106+ volumes, 14,153 titles, and 150+ seat reading spaces.",
        highlights: [
          "Digital Library wing with 12 high-speed workstations with IEEE Xplore, ScienceDirect, and NPTEL access",
          "Extensive collection of engineering, AI, data science, algorithms, and competitive exam books",
          "Reprography, quiet study zones, and reference archives"
        ],
        queryPrompt: "Tell me about the Central Library facilities and timings at GPREC"
      },
      {
        id: "indoor-stadium",
        name: "Indoor Sports Stadium & Grounds",
        shortName: "Indoor Stadium & Gym",
        icon: "🏟️",
        area: "North-East Campus Perimeter",
        badge: "Sports & Fitness",
        visitorTip: "Tournament-grade wooden badminton courts, table tennis, gym, plus cricket, football, and basketball grounds.",
        summary: "Multipurpose sports complex housing indoor wooden badminton courts, table tennis, fitness gym, and expansive athletic grounds.",
        highlights: [
          "Indoor stadium for badminton, table tennis, carrom, and chess",
          "Equipped fitness gymnasium and outdoor grounds for cricket and basketball"
        ],
        queryPrompt: "What sports and gym facilities are available at GPREC?"
      },
      {
        id: "atm-health-amenities",
        name: "Main Gate Amenities, 24/7 ATM & Health Clinic",
        shortName: "Gate, ATM & Health Clinic",
        icon: "🏥",
        area: "Main Security Gate & Admin Annex",
        badge: "Visitor Amenities",
        visitorTip: "24/7 Canara Bank & SBI ATMs, campus medical dispensary for emergency first aid, RO water stations, and visitor parking.",
        summary: "Essential conveniences located right at the campus entrance for visiting students, participants, and parents.",
        highlights: [
          "24/7 Cash ATMs (Canara Bank & SBI) located right inside the Main Security Gate",
          "Campus Health Centre & Dispensary providing free emergency consultations and medicines",
          "RO chilled drinking water dispensers installed on all academic floors"
        ],
        queryPrompt: "Where is the ATM and health center on GPREC campus?"
      }
    ]
  }
];

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
