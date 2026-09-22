/**
 * Curated In-Campus Walking Directions & Landmark Waypoints for GPREC Kurnool
 * Specially designed for CodeX 4.0 coding event participants navigating the campus.
 */

export const CAMPUS_LANDMARKS = {
  "csm-labs": {
    name: "CSM Labs & Coding Arena",
    building: "CSM Block (Intel AI/ML Hub)",
    walkingSteps: [
      {
        step: 1,
        title: "Enter via Main Gate",
        instruction: "Pass through the main security arch. Keep straight on the paved central driveway.",
        landmark: "Security Gate & Information Desk",
        icon: "🚪",
      },
      {
        step: 2,
        title: "Pass Administrative Block",
        instruction: "Continue straight past the Administrative Block and the flagpole on your left.",
        landmark: "Admin Block Quadrangle",
        icon: "🏛️",
      },
      {
        step: 3,
        title: "Spot Central Library & Garden",
        instruction: "At the central roundabout, veer slightly right past the garden walkway toward the engineering blocks.",
        landmark: "Central Green Garden",
        icon: "🌳",
      },
      {
        step: 4,
        title: "Arrive at CSM Block",
        instruction: "Enter the CSM building for Intel Unnati AI/ML Lab & CodeX 4.0 Arena.",
        landmark: "CSM Main Portico & Stairwell",
        icon: "💻",
      },
    ],
  },
  "food-court": {
    name: "Student Food Court & Refreshments",
    building: "Central Dining Zone",
    walkingSteps: [
      {
        step: 1,
        title: "Start from Central Roundabout",
        instruction: "Face north toward the CSE/CSM block. Take the pathway turning right (east).",
        landmark: "East Walkway Signpost",
        icon: "🧭",
      },
      {
        step: 2,
        title: "Walk past Innovation Hub",
        instruction: "Pass the CIE Innovation Hub on your left.",
        landmark: "CIE Building",
        icon: "💡",
      },
      {
        step: 3,
        title: "Arrive at Food Court",
        instruction: "The open canopy dining area and cafeteria are straight ahead.",
        landmark: "Food Court Entrance",
        icon: "🍱",
      },
    ],
  },
  "cafeteria": {
    name: "Campus Cafeteria / Canteen",
    building: "Near Mechanical & Workshop Area",
    walkingSteps: [
      {
        step: 1,
        title: "Head toward Central Garden",
        instruction: "From the main entrance or admin building, head straight past the library lawn.",
        landmark: "Library West Path",
        icon: "🚶",
      },
      {
        step: 2,
        title: "Turn Right near Workshop Road",
        instruction: "Take the right turn towards the shaded banyan tree. The cafeteria entrance is clearly signposted.",
        landmark: "Campus Banyan Tree & Shaded Lawn",
        icon: "🌳",
      },
      {
        step: 3,
        title: "Cafeteria Dining Hall",
        instruction: "Spacious seating hall offering breakfast, lunch thalis, dosa, and quick bites.",
        landmark: "Main Canteen Hall",
        icon: "☕",
      },
    ],
  },
  "auditorium": {
    name: "Central Auditorium",
    building: "Near Main Admin & ECE Block",
    walkingSteps: [
      {
        step: 1,
        title: "Walk straight from Gate",
        instruction: "Proceed 80 meters from the gate. The auditorium is adjacent to the main administrative complex.",
        landmark: "Admin Block Left Wing",
        icon: "🏛️",
      },
      {
        step: 2,
        title: "Enter Auditorium Foyer",
        instruction: "Climb the steps into the grand air-conditioned auditorium lobby for opening ceremony and prize distribution.",
        landmark: "Auditorium Main Double Doors",
        icon: "🎭",
      },
    ],
  },
  "central-library": {
    name: "Central Library & Digital Resource Centre",
    building: "Central Campus Building",
    walkingSteps: [
      {
        step: 1,
        title: "Follow the Central Avenue",
        instruction: "Walk 120 meters straight down the main avenue from the gate.",
        landmark: "Central Garden Roundabout",
        icon: "🚶",
      },
      {
        step: 2,
        title: "Enter Library Portico",
        instruction: "Two-story building with reading rooms, reference books, and quiet study zones.",
        landmark: "Library Glass Entrance",
        icon: "📚",
      },
    ],
  },
  "amphitheatre": {
    name: "Open Air Amphitheatre",
    building: "Opposite Student Activity Plaza",
    walkingSteps: [
      {
        step: 1,
        title: "Take Path between Library & Admin",
        instruction: "Follow the stone-paved walkway heading east.",
        landmark: "East Paved Walkway",
        icon: "🚶",
      },
      {
        step: 2,
        title: "Tiered Seating Gallery",
        instruction: "Large open-air amphitheatre with stage for cultural shows, coding event announcements, and networking.",
        landmark: "Open Stage & Grass Slopes",
        icon: "🎪",
      },
    ],
  },
};

/**
 * Get turn-by-turn landmark steps for a given destination ID.
 * Generates sensible default cues if not explicitly hardcoded.
 */
export function getLandmarkGuide(destId, destName) {
  if (CAMPUS_LANDMARKS[destId]) {
    return CAMPUS_LANDMARKS[destId];
  }

  return {
    name: destName || "Campus Location",
    building: "GPREC Campus",
    walkingSteps: [
      {
        step: 1,
        title: "Start from Current Spot or Main Gate",
        instruction: "Follow the on-screen compass direction arrow and paved campus walkway.",
        landmark: "Campus Main Walkway",
        icon: "🚶",
      },
      {
        step: 2,
        title: "Follow Campus Wayfinding Signboards",
        instruction: `Keep walking in the direction of ${destName}. Look for blue directional overhead signs.`,
        landmark: "Wayfinding Signs",
        icon: "🧭",
      },
      {
        step: 3,
        title: "Arrive at Destination",
        instruction: `Look for the entrance portico of ${destName}. Volunteers are available nearby to guide you inside.`,
        landmark: "Building Entrance",
        icon: "📍",
      },
    ],
  };
}
