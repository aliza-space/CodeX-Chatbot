// Official verified GPREC campus data sourced from www.gprec.ac.in and Coders' Club GPREC

export const GPREC_INFO = {
  name: "G. Pulla Reddy Engineering College (Autonomous)",
  shortName: "GPREC Kurnool",
  location: "G. Pulla Reddy Nagar, Nandyal Road, Kurnool, AP - 518007",
  website: "https://www.gprec.ac.in",
  tagline: "Explore GPREC's academic and student facilities",
};

export const CAMPUS_ZONES = [
  {
    id: "academic-zone",
    name: "Academic & Learning Area",
    shortName: "Academic Area",
    subtitle: "Department blocks, computer laboratories & research centres",
    icon: "🏛️",
    badge: "Zone 1",
    themeColor: "blue",
    overview: "Explore GPREC's academic and learning spaces across engineering departments, software laboratories, and innovation hubs.",
    facilities: [
      {
        id: "csm-labs",
        name: "CSM Computer Labs & Intel AI/ML Hub",
        shortName: "CSM Labs (Hackathon Hub)",
        icon: "💻",
        area: "East Academic Quadrangle • Ground to 2nd Floor",
        badge: "CodeX 4.0 Hackathon Hub",
        isHackathonHub: true,
        summary: "Intel Unnati AI/ML Lab (CSM Lab 6), Drone & Robotics Lab, Python programming, and advanced systems software laboratories.",
        highlights: [
          "2nd Floor: Intel Unnati AI/ML Center (CSM Lab 6) with high-end workstations — primary arena for CodeX 4.0 Hackathon",
          "Ground Floor: Core Programming Labs 1 & 2 (Lenovo ThinkCentre Neo 50S) and Drone & Robotics Research Lab",
          "1st Floor: Advanced Software & DBMS Labs 3–5 and tutorial seminar halls",
          "Equipped with 1 Gbps high-speed fiber internet and 100% online UPS power backup"
        ],
        queryPrompt: "Tell me more about CSM Computer Labs and the Intel AI/ML Lab at GPREC"
      },
      {
        id: "csm-department",
        name: "CSM Department (CSE AI & ML)",
        shortName: "CSM Dept Office",
        icon: "🧠",
        area: "Ground Floor, CSM Block",
        badge: "Department Office",
        summary: "Headquarters of Computer Science & Engineering (AI & ML), HOD chamber, faculty cabins, and student counseling desk.",
        highlights: [
          "Administrative headquarters for CSE (Artificial Intelligence & Machine Learning)",
          "Faculty consultation rooms and student academic counseling desk"
        ],
        queryPrompt: "Tell me about the CSM Department at GPREC"
      },
      {
        id: "cse-block",
        name: "CSE Department Block",
        shortName: "CSE Block",
        icon: "🖥️",
        area: "Central-East Academic Wing • Ground to 2nd Floor",
        summary: "Core Computer Science & Engineering department classrooms, networking labs, cloud computing, and software testing centres.",
        highlights: [
          "Core CSE department lecture theatres and faculty chambers",
          "Specialized networking, operating systems, and web technologies labs"
        ],
        queryPrompt: "Tell me about the CSE Department Block at GPREC"
      },
      {
        id: "ece-eee-block",
        name: "ECE & EEE Department Block",
        shortName: "ECE / EEE Block",
        icon: "⚡",
        area: "North-East Academic Wing • Ground to 3rd Floor",
        summary: "Electronics & Communication and Electrical & Electronics department laboratories, VLSI design, DSP, and IoT prototyping labs.",
        highlights: [
          "Microprocessor, VLSI design, and communication systems laboratories",
          "Power systems and electrical machines research centres"
        ],
        queryPrompt: "Tell me about the ECE and EEE Department at GPREC"
      },
      {
        id: "mech-civil-block",
        name: "Mechanical & Civil Engineering Block",
        shortName: "Mech & Civil Block",
        icon: "⚙️",
        area: "South-West Academic Wing • Ground to 2nd Floor",
        summary: "Central mechanical workshops, CNC machining, CAD/CAM design centres, and civil structural/fluid mechanics laboratories.",
        highlights: [
          "Central mechanical workshop and CNC prototyping facilities",
          "Civil engineering survey, fluid mechanics, and concrete testing labs"
        ],
        queryPrompt: "Tell me about the Mechanical and Civil Engineering Block at GPREC"
      },
      {
        id: "humanities-block",
        name: "Humanities & Basic Sciences",
        shortName: "Basic Sciences Block",
        icon: "🔬",
        area: "Ground & 1st Floor, Academic Quadrangle",
        summary: "Applied Physics, Engineering Chemistry, and English Interactive Language Communication laboratories.",
        highlights: [
          "Physics and Chemistry laboratories for undergraduate engineering",
          "Multimedia digital language laboratory for professional communications"
        ],
        queryPrompt: "Tell me about the Humanities and Basic Sciences Department at GPREC"
      }
    ]
  },
  {
    id: "common-facilities-zone",
    name: "Student & Common Facilities Area",
    shortName: "Common Facilities",
    subtitle: "Central library, auditorium, cafeteria, food court & student amenities",
    icon: "🌟",
    badge: "Zone 2",
    themeColor: "emerald",
    overview: "Explore facilities commonly used by students and visitors, including research libraries, dining plazas, event arenas, and health care.",
    facilities: [
      {
        id: "central-library",
        name: "Central Library & Digital Wing",
        shortName: "Central Library",
        icon: "📚",
        area: "Central Academic Quadrangle",
        badge: "Research & Literature",
        summary: "Fully automated with SLIM 21, housing 66,000+ volumes, 14,000+ titles, 12 digital workstations, and 150+ seat reading halls.",
        highlights: [
          "66,106+ volumes and 14,153 titles across engineering, AI, basic sciences, and competitive exams",
          "Digital Library with high-speed access to IEEE Xplore, ScienceDirect, and NPTEL lectures",
          "Open 9:00 AM to 7:00 PM on all working days with reference and reprography services"
        ],
        queryPrompt: "Tell me about the Central Library facilities and timings at GPREC"
      },
      {
        id: "auditorium",
        name: "Silver Jubilee Auditorium",
        shortName: "Auditorium",
        icon: "🎭",
        area: "Near Main Campus Entrance Gate",
        badge: "Keynote & Ceremonies",
        summary: "Fully air-conditioned 1,000+ seat indoor auditorium with Bose audio and dual projectors — CodeX 4.0 Guest Keynote venue.",
        highlights: [
          "Acoustically engineered auditorium accommodating over 1,000 attendees",
          "Equipped for national symposiums, college ceremonies, and guest keynote addresses",
          "Venue for Dodagatta Nihar's CodeX 4.0 Keynote presentation"
        ],
        queryPrompt: "Tell me about the Silver Jubilee Auditorium at GPREC"
      },
      {
        id: "amphitheatre",
        name: "Open Air Amphitheatre (\"Amphi\")",
        shortName: "Open Air Amphitheatre",
        icon: "🎤",
        area: "East Courtyard Lawn",
        badge: "Cultural & Social Hub",
        summary: "Tiered semi-circular stone terrace arena accommodating 800+ students for cultural fests, music jams, and hackathon mixers.",
        highlights: [
          "Premier outdoor gathering space for student induction programs and club mixers",
          "Surrounded by manicured garden lawns and tree-shaded pathways"
        ],
        queryPrompt: "Tell me about the Open Air Amphitheatre at GPREC"
      },
      {
        id: "cafeteria",
        name: "Main Cafeteria & College Canteen",
        shortName: "Main Canteen",
        icon: "🍴",
        area: "South-East Dining Block",
        badge: "Dining & Breakfast",
        summary: "Fresh South Indian breakfast (idli, dosas, upma), vegetarian lunch thalis, authentic filter coffee, tea, and bakery snacks.",
        highlights: [
          "Operating 8:30 AM to 5:30 PM on college and hackathon event days",
          "Subsidized student-friendly pricing monitored by the institutional Canteen Committee"
        ],
        queryPrompt: "What food and breakfast options are available in GPREC Canteen?"
      },
      {
        id: "food-court",
        name: "Campus Food Court",
        shortName: "Food Court",
        icon: "🥤",
        area: "Central Amenities Plaza",
        badge: "Lifestyle & Wi-Fi Hub",
        summary: "Vibrant open-air hub with outdoor canopy tables, sandwiches, pizzas, rolls, fruit juices, mocktails, and campus Wi-Fi.",
        highlights: [
          "Shaded outdoor seating with juice & dessert parlor",
          "Prime breakout and relaxation spot for hackathon teams between coding sprints"
        ],
        queryPrompt: "Tell me about the Campus Food Court and dining options at GPREC"
      },
      {
        id: "training-placement",
        name: "Training & Placement Cell (T&P)",
        shortName: "Training & Placement",
        icon: "🏢",
        area: "Administrative Annex",
        badge: "Careers & Internships",
        summary: "Corporate interview suites, group discussion cabins, and placement drives connecting students with recruiters and sponsors.",
        highlights: [
          "Coordinates campus recruitment drives, technical bootcamps, and career mentoring",
          "Liaison hub for industry partners including technical sponsor WeDevit"
        ],
        queryPrompt: "Tell me about Training and Placement Cell at GPREC"
      },
      {
        id: "indoor-stadium",
        name: "Indoor Sports Stadium & Fitness Gym",
        shortName: "Indoor Stadium & Gym",
        icon: "🏟️",
        area: "North-East Campus Perimeter",
        badge: "Sports & Fitness",
        summary: "Multipurpose sports complex with wooden badminton courts, table tennis, modern fitness gym, and outdoor sports grounds.",
        highlights: [
          "Tournament-grade wooden badminton courts and table tennis arenas",
          "Cardio and strength training fitness gymnasium and expansive sports grounds"
        ],
        queryPrompt: "What sports and gym facilities are available at GPREC?"
      },
      {
        id: "atm-health",
        name: "Health Centre & Banking ATMs",
        shortName: "Health Centre & ATMs",
        icon: "🏥",
        area: "Main Security Gate & Admin Annex",
        badge: "Health & Banking",
        summary: "Resident medical officer offering free medical first aid, emergency treatment, and 24/7 Canara Bank & SBI ATMs.",
        highlights: [
          "Campus dispensary with qualified staff providing free emergency health consultations",
          "24/7 cash withdrawal ATMs immediately inside the Main Entrance Gate"
        ],
        queryPrompt: "Where is the health center and ATM located on GPREC campus?"
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
        (facility.id === "csm-labs" && (q.includes("csm") || q.includes("intel") || q.includes("hackathon") || q.includes("lab"))) ||
        (facility.id === "central-library" && (q.includes("library") || q.includes("book"))) ||
        (facility.id === "cafeteria" && (q.includes("canteen") || q.includes("cafeteria") || q.includes("breakfast"))) ||
        (facility.id === "food-court" && (q.includes("food court") || q.includes("juice") || q.includes("pizza"))) ||
        (facility.id === "auditorium" && (q.includes("auditorium") || q.includes("keynote") || q.includes("hall") || q.includes("seminar"))) ||
        (facility.id === "amphitheatre" && (q.includes("amphi") || q.includes("amphitheatre"))) ||
        (facility.id === "indoor-stadium" && (q.includes("stadium") || q.includes("sports") || q.includes("gym"))) ||
        (facility.id === "atm-health" && (q.includes("atm") || q.includes("health") || q.includes("doctor") || q.includes("medical"))) ||
        (facility.id === "training-placement" && (q.includes("placement") || q.includes("interview") || q.includes("wedevit")));

      if (match) return { zone, facility };
    }
  }

  return null;
}
