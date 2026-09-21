// Parses /events, /register, /resources, /team, /roadmap dsa|web|ml
// into a structured intent the ragPipeline can use to bias retrieval filters
// and skip the LLM roundtrip for pure listing commands where useful.

const ROADMAP_TRACKS = ["dsa", "web", "ml"];

export function parseSlashCommand(input) {
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) return null;

  const [cmdRaw, ...rest] = trimmed.slice(1).split(/\s+/);
  const cmd = cmdRaw.toLowerCase();
  const arg = rest.join(" ").toLowerCase();

  switch (cmd) {
    case "events":
      return { command: "events", filter: { category: "event" }, expandedQuery: "What are the current and upcoming events at Coders' Club GPREC?" };
    case "register":
      return { command: "register", filter: { category: "event" }, expandedQuery: "How do I register for the current event, including fee, deadline and registration link?" };
    case "resources":
      return { command: "resources", filter: { category: "resource" }, expandedQuery: "What learning resources and roadmaps does Coders' Club GPREC provide?" };
    case "team":
      return { command: "team", filter: { category: "team" }, expandedQuery: "Who are the team members, coordinators and their roles in Coders' Club GPREC?" };
    case "roadmap": {
      const track = ROADMAP_TRACKS.includes(arg) ? arg : null;
      return {
        command: "roadmap",
        track,
        filter: { category: "resource", tags: track ? [track] : undefined },
        expandedQuery: track
          ? `Give me the ${track.toUpperCase()} learning roadmap.`
          : "Which roadmap do you want: DSA, web development, or ML? (usage: /roadmap dsa|web|ml)",
        needsClarification: !track,
      };
    }
    default:
      return { command: "unknown", expandedQuery: trimmed };
  }
}
