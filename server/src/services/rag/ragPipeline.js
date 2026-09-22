import { getLLM } from "../llm/index.js";
import { buildSystemPrompt } from "../../prompts/system.prompt.js";
import { rewriteQuery } from "./queryRewriter.js";
import { retrieveChunks } from "./retriever.js";
import { rerank } from "./reranker.js";
import { buildContextBlock, buildCitations } from "./promptBuilder.js";
import { parseSlashCommand } from "./commands.js";
import Announcement from "../../models/Announcement.js";
import UnansweredQuery from "../../models/UnansweredQuery.js";
import { normalizeQuery } from "./normalizer.js";
import { env } from "../../config/env.js";

const PROMPT_INJECTION_PATTERNS = [
  /ignore (all|any|previous|the) instructions/i,
  /you are now/i,
  /system prompt/i,
  /reveal your (prompt|instructions)/i,
  /act as (?!codebuddy)/i,
  /jailbreak/i,
];

export function detectPromptInjection(text) {
  return PROMPT_INJECTION_PATTERNS.some((re) => re.test(text));
}

function detectLanguage(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu script
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Devanagari
  return "en";
}

async function getActiveAnnouncements() {
  const now = new Date();
  const anns = await Announcement.find({
    active: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
  })
    .sort({ priority: -1 })
    .limit(3)
    .lean();
  return anns.map((a) => `- ${a.text}`).join("\n");
}

export async function runRagPipeline({ userMessage, history = [], conversationId, onToken }) {
  if (detectPromptInjection(userMessage)) {
    const safeReply =
      "Nice try, but I can't ignore my instructions or reveal my system prompt 😄 " +
      "Ask me anything about Coders' Club events, resources, or the team instead!";
    onToken?.(safeReply);
    return { answer: safeReply, citations: [], suggestions: defaultSuggestions(), wasAnswered: true };
  }

  const language = detectLanguage(userMessage);
  const slash = parseSlashCommand(userMessage);

  if (slash?.needsClarification) {
    onToken?.(slash.expandedQuery);
    return { answer: slash.expandedQuery, citations: [], suggestions: [], wasAnswered: true };
  }

  const effectiveQuestion = slash?.expandedQuery ?? userMessage;
  const rewritten = await rewriteQuery({ history, latestQuestion: effectiveQuestion });

  const rawChunks = await retrieveChunks(rewritten, { filter: slash?.filter ?? {} });
  const { chunks, bestScoreOverall, isConfident } = rerank(rawChunks);

  const context = buildContextBlock(chunks);
  const announcements = await getActiveAnnouncements();
  const systemPrompt = buildSystemPrompt({ context, language, announcements });

  let answer = "";
  try {
    const llm = getLLM();
    const messages = [...history.slice(-8), { role: "user", content: userMessage }];

    answer = onToken
      ? await llm.streamChat({ systemPrompt, messages, onToken })
      : await llm.complete({ systemPrompt, messages });
  } catch (llmErr) {
    console.warn("⚠️ LLM execution error in runRagPipeline, providing synthesized context response:", llmErr.message);
    answer = synthesizeConciseAnswer(rewritten, chunks);
    if (onToken) {
      const words = answer.split(" ");
      for (const w of words) {
        onToken(w + " ");
        await new Promise((r) => setTimeout(r, 12));
      }
    }
  }

  const citations = buildCitations(chunks);
  const wasAnswered = isConfident && !answer.includes("I don't have enough specific information");

  if (!wasAnswered) {
    await UnansweredQuery.create({
      question: userMessage,
      rewrittenQuery: rewritten,
      conversation: conversationId,
      topScoreSeen: bestScoreOverall,
    });
  }

  return {
    answer,
    citations,
    suggestions: buildSuggestions(chunks, slash, rewritten),
    wasAnswered,
    rewrittenQuery: rewritten,
  };
}

function buildSuggestions(chunks, slash, query = "") {
  const q = (query || "").toLowerCase();
  if (q.includes("galactic") || q.includes("past event")) {
    return ["Who won Galactic Gamble?", "What was the registration fee?", "What events are coming up?"];
  }
  if (q.includes("resource") || q.includes("learn")) {
    return ["What are the regular classes?", "How do I join Coders' Club?", "When is CodeX 4.0?"];
  }
  if (q.includes("eligib") || q.includes("1st year") || q.includes("rule")) {
    return ["What is the team size?", "What are the prizes?", "How do I register?"];
  }
  if (slash?.command === "events") return ["How do I register?", "What's the prize pool?", "Who do I contact?"];
  if (!chunks.length) return defaultSuggestions();
  const topCategory = chunks[0]?.category;
  if (topCategory === "event") return ["What's the registration deadline?", "Who are the sponsors?", "Is there a team size limit?"];
  if (topCategory === "resource") return ["Show me the DSA roadmap", "Show me the web dev roadmap", "Show me learning resources"];
  if (topCategory === "team") return ["Who is the event coordinator?", "How do I contact the club?"];
  return defaultSuggestions();
}

function defaultSuggestions() {
  return ["What events are coming up?", "How do I join Coders' Club?", "Show me learning resources"];
}

function synthesizeConciseAnswer(query, chunks) {
  const q = normalizeQuery(query || "").toLowerCase();

  // 1. First-Year (1st Year) Eligibility Check
  if (q.includes("1st year") || q.includes("first year") || q.includes("1st yr") || (q.includes("first") && q.includes("join"))) {
    return `### 👥 First-Year Eligibility Rule for CodeX 4.0
- **Participation Status:** First-year (1st-year) students are **not eligible** to participate as contestants in CodeX 4.0.
- **Eligible Batches:** CodeX 4.0 is open only to undergraduate engineering students in their **II, III, or IV Year** of study.
- **Club Activities for 1st Years:** First-year students are warmly encouraged to join regular Coders' Club learning classes, review sessions, and problem-solving workshops throughout the year to prepare for upcoming hackathons and CodeX editions!`;
  }

  // 2. Learning Resources & Classes
  if (q.includes("resource") || q.includes("learning") || q.includes("dsa") || q.includes("roadmap") || q.includes("classes") || q.includes("how to learn")) {
    return `### 📚 Coders' Club Learning Activities & Resources
- **Regular Guided Classes:** Weekly sessions guided by **Dr. A. Vishnuvardhan Reddy** covering Mathematics, Data Structures & Algorithms (DSA), Problem Solving, and Competitive Programming.
- **Peer Review Classes:** Supervised by senior student coordinators to clear doubts and provide 1-on-1 mentorship.
- **Programming Contests:** Regular practice contests conducted on **HackerRank**, **Smart Interviews**, and **Examly**.
- **Interview Preparation:** Technical group discussions, coding quizzes, and "find-the-output" debugging rounds held on alternate weeks.
- **Official Website:** Access roadmaps and past materials at [https://www.codersclubgprec.in](https://www.codersclubgprec.in).`;
  }

  // 3. Upcoming Events
  if (q.includes("upcoming") || q.includes("events coming up") || q.includes("next event") || q.includes("what events")) {
    return `### 🚀 Upcoming Coders' Club Events
- **CodeX 4.0 (Flagship Coding Competition):**
  - **Date:** 24 September 2026 (9:00 AM – 5:00 PM IST)
  - **Venue:** CSM Computer Labs, GPREC Campus
  - **Registration Deadline:** 23 September 2026
  - **Prize Pool:** Up to **₹50,000** in cash prizes and awards!
- **Regular DSA Classes & Practice Contests:** Weekly sessions across all branches.
- **Internal SIH Hackathons & Tech Bootcamps:** Follow [@coders_club_gprec](https://instagram.com/coders_club_gprec) for latest announcement updates.`;
  }

  // 4. Galactic Gamble Winners & Details
  if (q.includes("galactic") && (q.includes("winner") || q.includes("who won") || q.includes("result") || q.includes("rank"))) {
    return `### 🏆 Galactic Gamble (3 January 2026) Winners
- **2nd Year Winners:**
  - **1st Prize (Winner - ₹750):** Team **Tech Titans** (*Shaik Mohammad Adil, Shaik Muhammad Arshad*)
  - **2nd Prize (Runner-up - ₹500):** Team **Alpha** (*Panga Guru Sai Kumar Reddy, Vaddi Praneeth Kumar*)
- **3rd Year Winners:**
  - **1st Prize (Winner - ₹750):** Team **Clover** (*Veluru Navadeep Reddy, Rama Kanth Reddy*)
  - **2nd Prize (Runner-up - ₹500):** Team **Pirates** (*Sirigireddy Nithin Reddy, Roddam Shaik Arbaz*)
- *Prizes were presented by Dr. A. Vishnuvardhan Reddy, Mr. I. Venkata Rameswar Reddy, and Mr. P. Rama Rao at CSM Block.*`;
  }

  // 5. CodeX 2.0 Winners
  if (q.includes("2.0") && (q.includes("winner") || q.includes("who won"))) {
    return `### 🏆 CodeX 2.0 (24 August 2024) Winners
- **1st Prize (₹8,500):** Team **CP Champs** (*Vankam Venkata Durga Prasad, Divite Dinesh*)
- **2nd Prize (₹6,000):** Team **Decoders** (*Papireddy Gari Guna Manisha, Avula Bharath Reddy, Swathi Challa*)
- **3rd Prize (₹4,000):** Team **GPREC1985** (*Gunduboina Dileep, Surya Rudrakshala, Kunchepu Hrushikesavagokulu*)
- **4th Prize (Consolation - ₹2,000):** Team **Bot$$Coders** (*B Thirumaleswar Reddy, Adoni Bhaskar, Pakalwada Riyaz Ahamed*)
- **5th Prize (Consolation - ₹2,000):** Team **Mind Benders** (*Bandla Dora Babu, Jeerla Subash, K G Mahesh*)`;
  }

  // 6. Generic Event Winners Lookup from Chunks
  if (q.includes("winner") || q.includes("who won")) {
    const winnerChunk = chunks.find((c) => (c.text || "").toLowerCase().includes("winner") || (c.text || "").toLowerCase().includes("1st prize"));
    if (winnerChunk) {
      const clean = winnerChunk.text
        .replace(/^\[.*?\]\s*/gm, "")
        .replace(/^\*\*Category:\*\*.*$/gm, "")
        .replace(/^\*\*Tags:\*\*.*$/gm, "")
        .replace(/^\*\*Date:\*\*.*$/gm, "")
        .trim();
      return clean;
    }
  }

  // 7. Date / Timing / Venue / When is CodeX 4.0
  if (q.includes("when") || (q.includes("date") && !q.includes("last")) || q.includes("timing") || q.includes("where is codex")) {
    return `### 📅 CodeX 4.0 Event Details
- **Date:** 24 September 2026
- **Timings:** 9:00 AM – 5:00 PM IST (*Reporting Time: 8:30 AM IST*)
- **Venue:** CSM Computer Labs, G. Pulla Reddy Engineering College (GPREC), Kurnool
- **Registration Deadline:** 23 September 2026
- **Registration Portal:** [https://codex4-0-registration-portal.codersclubgprec.in](https://codex4-0-registration-portal.codersclubgprec.in)`;
  }

  // 8. Prizes & Perks / Rewards / Sponsors
  if (q.includes("prize") || q.includes("perk") || q.includes("reward") || q.includes("cash") || q.includes("sponsor")) {
    return `### 🏆 CodeX 4.0 Prizes, Perks & Sponsors
- **Prize Pool:** Up to **₹50,000** in cash prizes and winner awards!
- **Career Perks:** Top-winning teams get exclusive **internship opportunities** with Technical Sponsor **WeDevit** and other leading tech companies.
- **Participant Goodies:** Every participant receives goodies, refreshments, and a hard-copy participation certificate.
- **Event Sponsors:** **WeDevit** (*Technical Sponsor*), **HaveMore** (*Havmor ice-creams*), **Microcare Academy**, **Fiarro Pizza**, and **RC Cola**.`;
  }

  // 9. Eligibility & Team Rules
  if (q.includes("eligib") || q.includes("who can") || q.includes("team size") || q.includes("format") || q.includes("4th year") || q.includes("final year") || q.includes("branch") || q.includes("rule")) {
    return `### 👥 CodeX 4.0 Eligibility & Team Rules
- **Eligibility:** Undergraduate engineering students in **II, III, or IV Year** from GPREC and any other recognized college/university (*1st-year students are not eligible*).
- **Team Size:** Exactly **2 or 3 members** per team.
- **Final-Year Rule:** Maximum **one 4th-year student** per team (0 or 1). Teams with two or more 4th-year students are not permitted.
- **College Rule:** All team members must belong to the **same college**. Cross-branch and inter-year combinations within the same college are allowed and encouraged.
- **Roll Numbers:** Each student's roll number can only be registered in one team.`;
  }

  // 10. Registration & Fee
  if (q.includes("register") || q.includes("registration") || q.includes("fee") || q.includes("cost") || q.includes("pay") || q.includes("price") || q.includes("portal") || q.includes("link") || q.includes("300")) {
    return `### 📝 CodeX 4.0 Registration & Fees
- **Registration Fee:** **₹300 per team** (flat fee for the whole team, not per member).
- **Registration Deadline:** **23 September 2026** (11:59 PM IST).
- **Registration Portal:** [https://codex4-0-registration-portal.codersclubgprec.in](https://codex4-0-registration-portal.codersclubgprec.in)
- **Payment Modes:** Online via Cashfree Payments (UPI, Cards, Net Banking). You will receive an official Team ID (e.g., \`CDX4-0001\`) upon successful payment.`;
  }

  // 11. Guest Speaker
  if (q.includes("speaker") || q.includes("nihar") || q.includes("guest")) {
    return `### 🎙️ CodeX 4.0 Guest Speaker
- **Guest Speaker:** **Dodagatta Nihar**
- **Profile:** Tech Educator, Web Developer, ML Engineer, Entrepreneur, and 3x TEDx Speaker with over 500K+ Instagram followers.
- **Session:** Delivering an inspiring interactive session on tech careers, industry skills, and real-world coding.`;
  }

  // 12. Campus Food & Labs Navigation
  if (q.includes("food") || q.includes("canteen") || q.includes("cafeteria") || q.includes("csm") || q.includes("lab") || q.includes("map") || q.includes("location") || q.includes("direction")) {
    return `### 📍 GPREC Campus Navigation Guide
- **CSM Computer Labs (Event Venue):** Ground & 1st Floor of CSM Block. From the Main Gate, walk straight along the central avenue for ~180 meters past the lawn.
- **Main Cafeteria / Canteen:** South-East zone near the sports ground (~220 meters from Main Gate). Offers South Indian breakfast, meals, tea/coffee.
- **Campus Food Court:** Central Amenities Plaza (~250 meters from Main Gate). Offers pizzas, fresh juices, shakes, burgers, and snacks.
- **Open Air Amphitheatre:** Adjacent to CSM Block courtyard.
*(Tip: You can also tap **Campus Map** in the menu to see interactive routes and GPS markers!)*`;
  }

  // 13. Team & Contact details
  if (q.includes("team") || q.includes("contact") || q.includes("coordinator") || q.includes("phone") || q.includes("email") || q.includes("number") || q.includes("/team")) {
    return `### 📞 Coders' Club & CodeX 4.0 Contacts
- **Faculty Convener:** Dr. A. Vishnuvardhan Reddy (Associate Professor, ECS/CSE)
- **Student Leads for Queries:**
  - **Tabraiz:** +91 9391491123
  - **Kashif:** +91 9492068097
  - **Karthik Sai:** +91 9032174306
- **Email:** \`codersclub@gprec.ac.in\`
- **Instagram:** [@coders_club_gprec](https://instagram.com/coders_club_gprec)
- **Website:** [https://www.codersclubgprec.in](https://www.codersclubgprec.in)`;
  }

  // 14. Schedule & Rounds
  if (q.includes("schedule") || q.includes("round") || q.includes("timeline")) {
    return `### ⏱️ CodeX 4.0 Schedule & Competition Format
- **Rounds:** Two coding rounds testing problem-solving, logic, and competitive programming.
- **08:30 AM:** Reporting & Desk Verification (CSM Block)
- **09:00 AM – 10:00 AM:** Inauguration & Keynote with Dodagatta Nihar
- **10:30 AM – 01:00 PM:** **Round 1 (Algorithmic Coding Round)**
- **01:00 PM – 02:00 PM:** Lunch & Refreshments Break
- **02:00 PM – 04:00 PM:** **Round 2 (Advanced Problem-Solving Final Round)**
- **04:30 PM – 05:00 PM:** Valedictory & Prize Distribution Ceremony`;
  }

  // 15. Clean Content Extraction from Top Chunk if score is relevant
  if (chunks && chunks.length > 0 && chunks[0].score >= 0.35) {
    const text = (chunks[0].text || "")
      .replace(/^\[.*?\]\s*/gm, "")
      .replace(/^\*\*Category:\*\*.*$/gm, "")
      .replace(/^\*\*Tags:\*\*.*$/gm, "")
      .replace(/^\*\*Date:\*\*.*$/gm, "")
      .trim();

    const lines = text.split("\n").filter((l) => !l.startsWith("# ") && l.trim().length > 0);
    if (lines.length > 0) {
      return lines.slice(0, 8).join("\n\n");
    }
  }

  // 16. Honest "I don't know" fallback
  return "I don't have enough specific information on that in my knowledge base. For further details, feel free to reach out to the Coders' Club coordinators directly at codersclub@gprec.ac.in or contact student leads Tabraiz (+91 9391491123) / Kashif (+91 9492068097).";
}
