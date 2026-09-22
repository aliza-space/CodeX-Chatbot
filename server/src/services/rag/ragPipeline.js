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
  const directAnswer = synthesizeConciseAnswer(rewritten, chunks);
  const isConfidentDirectMatch = directAnswer && !directAnswer.includes("I don't have enough specific information");

  if (isConfidentDirectMatch) {
    answer = directAnswer;
    if (onToken) {
      const words = answer.split(" ");
      for (const w of words) {
        onToken(w + " ");
        await new Promise((r) => setTimeout(r, 10));
      }
    }
  } else {
    try {
      const llm = getLLM();
      const messages = [...history.slice(-8), { role: "user", content: userMessage }];

      answer = onToken
        ? await llm.streamChat({ systemPrompt, messages, onToken })
        : await llm.complete({ systemPrompt, messages });
    } catch (llmErr) {
      console.warn("⚠️ LLM execution fallback in runRagPipeline:", llmErr.message);
      answer = directAnswer || "I don't have enough specific information on that in my knowledge base. For further details, feel free to reach out to the Coders' Club coordinators directly at codersclub@gprec.ac.in.";
      if (onToken) {
        const words = answer.split(" ");
        for (const w of words) {
          onToken(w + " ");
          await new Promise((r) => setTimeout(r, 10));
        }
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

const STOPWORDS = new Set([
  "what", "are", "the", "and", "for", "who", "is", "how", "in", "of", "to", "a", "an",
  "on", "at", "by", "with", "from", "about", "me", "tell", "give", "show", "can", "you",
  "does", "do", "i", "my", "our", "we", "this", "that", "these", "those", "which", "where",
  "when", "why", "be", "been", "being", "have", "has", "had", "would", "should", "could",
  "please", "some", "any", "all"
]);

function extractExactAnswerFromChunks(query, chunks) {
  if (!chunks || chunks.length === 0) return null;

  const q = normalizeQuery(query).toLowerCase();
  const qWords = q.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  if (qWords.length === 0) return null;

  // 1. Match exact FAQ Q: / A: in chunks
  for (const chunk of chunks) {
    const text = chunk.text || "";
    if (text.includes("Q:") && text.includes("A:")) {
      const lines = text.split("\n");
      let bestFaq = null;
      let bestFaqScore = 0;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("Q:")) {
          const qLine = lines[i].slice(2).trim().toLowerCase();
          const qLineWords = qLine.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
          const matchCount = qWords.filter((w) => qLine.includes(w)).length;
          const score = matchCount / Math.max(qWords.length, qLineWords.length, 1);

          if (score > bestFaqScore && matchCount >= 2) {
            bestFaqScore = score;
            const aLines = [];
            for (let j = i + 1; j < lines.length && !lines[j].startsWith("Q:") && !lines[j].startsWith("##"); j++) {
              if (lines[j].trim()) aLines.push(lines[j].replace(/^A:\s*/, "").trim());
            }
            if (aLines.length > 0) {
              bestFaq = `### 💡 ${lines[i].replace(/^Q:\s*/, "")}\n\n${aLines.join("\n\n")}`;
            }
          }
        }
      }

      if (bestFaq && bestFaqScore >= 0.5) {
        return bestFaq;
      }
    }
  }

  // 2. Match exact markdown sub-section (## Title)
  for (const chunk of chunks) {
    const text = chunk.text || "";
    const sections = text.split(/\n(?=## )/);
    let bestSection = null;
    let bestSecScore = 0;

    for (const sec of sections) {
      if (!sec.startsWith("## ")) continue;
      const lines = sec.split("\n");
      const titleLine = lines[0].replace(/^##\s*/, "").toLowerCase();
      const titleWords = titleLine.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
      const matchCount = qWords.filter((w) => titleLine.includes(w)).length;
      const score = matchCount / Math.max(titleWords.length, qWords.length, 1);

      if (score > bestSecScore && (matchCount >= 2 || (qWords.length === 1 && titleWords.length === 1 && titleLine.includes(qWords[0])))) {
        bestSecScore = score;
        bestSection = sec;
      }
    }

    if (bestSection && bestSecScore >= 0.5) {
      return bestSection
        .replace(/^\[.*?\]\s*/gm, "")
        .replace(/^\*\*Category:\*\*.*$/gm, "")
        .replace(/^\*\*Tags:\*\*.*$/gm, "")
        .replace(/^\*\*Date:\*\*.*$/gm, "")
        .trim();
    }
  }

  return null;
}

function synthesizeConciseAnswer(query, chunks) {
  const q = normalizeQuery(query || "").toLowerCase();

  // 0. What is CodeX / CodeX 4.0 / Event Overview
  if (
    q === "what is codex" ||
    q === "what is codex 4.0" ||
    q === "about codex" ||
    q === "about codex 4.0" ||
    q === "tell me about codex" ||
    q === "codex" ||
    q === "codex 4.0" ||
    q.includes("what is codex") ||
    q.includes("about codex") ||
    (q.includes("codex") && (q.includes("intro") || q.includes("overview") || q.includes("details")))
  ) {
    return `### 🚀 What is CodeX 4.0?
**CodeX 4.0** is the flagship collegiate coding competition hosted by **Coders' Club** at **G. Pulla Reddy Engineering College (GPREC), Kurnool**.

- **Date & Timings:** 24 September 2026 (9:00 AM – 5:00 PM IST; Reporting at 8:30 AM IST).
- **Venue:** CSM Computer Labs, GPREC Campus, Kurnool.
- **Competition Structure:** Two coding rounds (Preliminary Round and Grand Finale) testing problem-solving, logic, and competitive programming.
- **Participation:** Teams of **2 to 3 members** (open to II, III, and IV year undergraduate engineering students).
- **Prize Pool:** Up to **₹50,000** total cash prizes, awards, and exclusive internship opportunities with Technical Sponsor **WeDevit**!
- **Registration:** ₹300 flat team fee on [https://codex4-0-registration-portal.codersclubgprec.in](https://codex4-0-registration-portal.codersclubgprec.in) (Deadline: 23 September 2026).`;
  }

  // 0.1 What is Coders' Club / About Club
  if (
    q.includes("what is coders club") ||
    q.includes("about coders club") ||
    q.includes("about the club") ||
    q.includes("what is the club") ||
    q.includes("tell me about coders club") ||
    q === "coders club"
  ) {
    return `### 💡 About Coders' Club GPREC
**Coders' Club** is the official student technical club of **G. Pulla Reddy Engineering College (GPREC), Kurnool**, focused on Data Structures and Algorithms (DSA), competitive programming, coding interviews, and hackathons.

- **Faculty Convener:** Dr. A. Vishnuvardhan Reddy (Associate Professor, ECS/CSE).
- **Core Activities:** Weekly problem-solving classes, peer review sessions, competitive coding contests on HackerRank, and technical interview preparation.
- **Flagship Events:** CodeX series (CodeX 2023, CodeX 2.0, CodeX 3.0, CodeX 4.0), Galactic Gamble, IdeaSprint, and OUTSYSLAYER Hackathons.
- **Official Website:** [https://www.codersclubgprec.in](https://www.codersclubgprec.in)
- **Instagram:** [@coders_club_gprec](https://instagram.com/coders_club_gprec)`;
  }

  // 0.2 How to Join / Recruitment / Membership
  if (
    q.includes("how to join") ||
    q.includes("how do i join") ||
    q.includes("recruitment") ||
    q.includes("become member") ||
    q.includes("membership")
  ) {
    return `### 🌟 How to Join Coders' Club GPREC
- **Annual Recruitment:** Coders' Club conducts an annual student recruitment process comprising a technical recruitment exam, coding round, technical interview, and group discussion.
- **Wildcard Entry:** Direct coding rounds and challenge-based admissions are also conducted periodically.
- **Announcements:** Future recruitment schedules, eligibility criteria, and application forms are announced on the official Instagram page: [@coders_club_gprec](https://instagram.com/coders_club_gprec).
- **Open Activities:** All students can attend open guest lectures, webinars, and public coding contests hosted by the club throughout the year!`;
  }

  // 0.4 How to Reach GPREC / Directions from Station / Bus Stand
  if (
    q.includes("reach") ||
    q.includes("railway") ||
    q.includes("station") ||
    q.includes("bus stand") ||
    q.includes("how to get to") ||
    q.includes("transport")
  ) {
    return `### 🚆 How to Reach GPREC Kurnool
- **From Kurnool City Railway Station (KLU):** Distance ~6.5 km (~15–20 mins). Auto-rickshaws are available 24/7 directly to *"Pulla Reddy College Gate"* on Nandyal Road. Local APSRTC buses toward Nandyal/Mahanandi also stop at the gate.
- **From Kurnool APSRTC New Bus Stand:** Distance ~5.0 km (~12–15 mins). City buses and autos are readily available along the highway route.
- **From Hyderabad (RGIA) / Anantapur / Tirupati:** Via National Highway 44 (NH-44) connected to Kurnool bypass; follow signs to Nandyal Road / GPREC campus.
- **Campus Address:** G. Pulla Reddy Nagar, Nandyal Road, Kurnool, Andhra Pradesh - 518007 (\`15.8073° N, 78.0375° E\`).`;
  }

  // 0.5 What to Bring on Event Day
  if (q.includes("what to bring") || q.includes("bring on") || q.includes("documents required") || q.includes("pass")) {
    return `### 🎒 What to Bring on CodeX 4.0 Event Day (24 Sept 2026)
1. **Physical College ID Card:** Original physical college identity card for every team member.
2. **Team ID / Confirmation Email:** Printed or digital confirmation with your unique Team ID (e.g., \`CDX4-0001\`).
3. **CodeX 4.0 Pass:** Downloaded hard copy of the CodeX 4.0 Pass from the registration portal.
- *Reporting Time:* 8:30 AM – 9:00 AM IST at **CSM Computer Labs, GPREC**.`;
  }

  // 0.6 Substitution & Team Changes
  if (q.includes("substitut") || q.includes("change member") || q.includes("replace member")) {
    return `### 🔄 Team Member Substitution Policy
- **Deadline for Substitution:** Team member substitution is permitted up to **23 September 2026** (11:59 PM IST).
- **Process:** The Team Leader must contact the student coordinators with valid credentials and the replacement student's college details.
- **Contact:** Tabraiz (+91 9391491123) / Kashif (+91 9492068097) / Karthik Sai (+91 9032174306).`;
  }

  // 0.7 IdeaSprint
  if (q.includes("ideasprint") || q.includes("idea sprint") || q.includes("e-summit")) {
    return `### 💡 IdeaSprint 2026 (21 January 2026)
- **Event:** A national-level innovation challenge organized by Coders' Club in collaboration with **E-Cell IIT Tirupati** as part of E-Summit '26.
- **Participation:** 85 teams of 3 members each.
- **Winner:** Team **Tech Phantoms** won the competition, qualifying for Round 2 at IIT Tirupati!`;
  }

  // 0.8 OUTSYSLAYER Hackathon
  if (q.includes("outsyslayer") || q.includes("beyondcampuz")) {
    return `### ⚡ OUTSYSLAYER Hackathon 2026 (25 February 2026)
- **Event:** An offline collegiate hackathon organized in partnership with **BeyondCampuz** covering three problem domains: AI Model Trainee, Education, and Health.
- **Participation:** 106 registered teams and 400+ participants.
- **Winner:** Team **Soul** won 1st Place!`;
  }

  // 0.9 Code Symposium
  if (q.includes("symposium") || q.includes("code symposium")) {
    return `### 💻 Code Symposium Series
- **Code Symposium 2K24 (4 May 2024):** Individual coding competition featuring a C-language quiz and 3 coding problems on Examly (154 registered participants, ₹50 fee). Winner: **P. V. S. S. Sravan** (₹1,000 prize).
- **Code Symposium 2K26 (25 March 2026):** Conducted in collaboration with **Smart Interviews** with 45 participants (₹50 fee). 1st: **D. Dinesh**, 2nd: **D. Sreenath Reddy**, 3rd: **P. Sree Charan Reddy**.`;
  }

  // 0.10 Nexus
  if (q.includes("nexus") || q.includes("webnex") || q.includes("codenex")) {
    return `### 🌐 Nexus 2K25 (17 December 2025)
- **Organized By:** GGSA Club in collaboration with Coders' Club.
- **Tracks:** **WebNex** (AI-powered website building) and **CodeNex** (DSA Problem Solving).
- **Participation:** 91 teams of 2 members each (₹50 registration fee per team).`;
  }

  // 0.11 Websites & Jignasa
  if (q.includes("jignasa") || (q.includes("website") && !q.includes("dsa")) || q.includes("official site") || q.includes("link")) {
    return `### 🌐 Official Websites
- **Coders' Club Official Website:** [https://www.codersclubgprec.in](https://www.codersclubgprec.in) *(Launched 22 August 2024)*.
- **CodeX 4.0 Registration Portal:** [https://codex4-0-registration-portal.codersclubgprec.in](https://codex4-0-registration-portal.codersclubgprec.in).
- **Jignasa Annual Technical Fest Website:** [https://jignasagprec.in](https://jignasagprec.in) *(Launched 17 September 2024)*.
- **GPREC College Website:** [https://www.gprec.ac.in](https://www.gprec.ac.in).`;
  }

  // 0.12 Faculty Convener & Coordinators
  if (q.includes("convener") || q.includes("convenor") || q.includes("faculty") || q.includes("vishnuvardhan") || q.includes("rama rao") || q.includes("mallesi")) {
    return `### 👨‍🏫 Coders' Club Faculty Team
- **Faculty Convener:** **Dr. A. Vishnuvardhan Reddy** (Associate Professor, Department of ECS / CSE).
- **Faculty Coordinators:**
  - **Sri P. Rama Rao** (Department of CSE)
  - **Sri V. Mallesi** (Department of CSE)
  - **Dr. R. Sudheer Babu** (Department of ECE)
  - **Dr. S. Anil Kumar** (Department of EEE)`;
  }

  // 1. First-Year (1st Year) Eligibility Check
  if (
    q.includes("1st year") ||
    q.includes("first year") ||
    q.includes("1st yr") ||
    (q.includes("first") && (q.includes("join") || q.includes("participate") || q.includes("eligible")))
  ) {
    return `### 👥 First-Year Eligibility Rule for CodeX 4.0
- **Participation Status:** First-year (1st-year) students are **not eligible** to participate as contestants in CodeX 4.0.
- **Eligible Batches:** CodeX 4.0 is open only to undergraduate engineering students in their **II, III, or IV Year** of study.
- **Club Activities for 1st Years:** First-year students are warmly encouraged to join regular Coders' Club learning classes, review sessions, and problem-solving workshops throughout the year to prepare for upcoming hackathons and future CodeX editions!`;
  }

  // 2. Learning Resources & Classes & Roadmaps
  if (
    q.includes("resource") ||
    q.includes("learning") ||
    q.includes("dsa") ||
    q.includes("roadmap") ||
    q.includes("classes") ||
    q.includes("how to learn")
  ) {
    return `### 📚 Coders' Club Learning Activities & Resources
- **Regular Guided Classes:** Guided by **Dr. A. Vishnuvardhan Reddy** covering Mathematics, Data Structures and Algorithms (DSA), Coding, and Problem Solving.
- **Contests & Practice:** Coding contests conducted on platforms such as **HackerRank** to prepare students for product-based company coding interviews and contests like CodeVita.
- **Interview Preparation:** Technical group discussions, coding quizzes, and "find-the-output" debugging rounds held on alternate weeks.
- **Workshops:** Generative AI bootcamps, Google Gemini Student Ambassador recruitment, and Code Symposium series.
- **Roadmaps:** Detailed DSA, web development, and ML roadmaps are not published in this knowledge base yet. For direct learning guidance, contact \`codersclub@gprec.ac.in\`.
- **Official Website:** [https://www.codersclubgprec.in](https://www.codersclubgprec.in)`;
  }

  // 3. Upcoming Events
  if (
    q.includes("upcoming") ||
    q.includes("events coming up") ||
    q.includes("next event") ||
    q.includes("what events")
  ) {
    return `### 🚀 Upcoming Coders' Club Events
- **CodeX 4.0 (Flagship Coding Competition):**
  - **Date:** 24 September 2026 (9:00 AM – 5:00 PM IST; Reporting at 8:30 AM IST)
  - **Venue:** CSM Computer Labs, GPREC Campus, Kurnool
  - **Registration Deadline:** 23 September 2026
  - **Prize Pool:** Up to **₹50,000**
- **Regular Classes & Practice Contests:** Weekly sessions across departments.
- **Recruitment & Bootcamps:** Follow [@coders_club_gprec](https://instagram.com/coders_club_gprec) for latest announcements.`;
  }

  // 4. Galactic Gamble Winners & Details
  if (
    q.includes("galactic") &&
    (q.includes("winner") || q.includes("who won") || q.includes("result") || q.includes("rank") || q.includes("prize"))
  ) {
    return `### 🏆 Galactic Gamble (3 January 2026) Winners
- **2nd Year Winners:**
  - **1st Prize (Winner - ₹750):** Team **Tech Titans** (*Shaik Mohammad Adil, Shaik Muhammad Arshad*)
  - **2nd Prize (Runner-up - ₹500):** Team **Alpha** (*Panga Guru Sai Kumar Reddy, Vaddi Praneeth Kumar*)
- **3rd Year Winners:**
  - **1st Prize (Winner - ₹750):** Team **Clover** (*Veluru Navadeep Reddy, Rama Kanth Reddy*)
  - **2nd Prize (Runner-up - ₹500):** Team **Pirates** (*Sirigireddy Nithin Reddy, Roddam Shaik Arbaz*)
- *Prizes were presented by Dr. A. Vishnuvardhan Reddy, Mr. I. Venkata Rameswar Reddy, and Mr. P. Rama Rao at CSM Block.*`;
  }

  // 5. CodeX 3.0 Winners
  if (
    q.includes("3.0") &&
    (q.includes("winner") || q.includes("who won") || q.includes("result"))
  ) {
    return `### 🏆 CodeX 3.0 (25 September 2025) Winners
- **1st Prize (₹10,000):** Team **!dpsolvers** (*IIITDM Kurnool* — P Sree Charan Reddy, Gopidi Vikranth Reddy)
- **2nd Prize (₹8,000):** Team **Unbeatable** (*GPREC*)
- **3rd Prize (₹6,000):** Team **CP Champs** (*GPREC*)
- *CodeX 3.0 had 94 teams and 282 participants, featuring guest speaker Sanjay Samuel (Talent Acquisition Manager).*`;
  }

  // 6. CodeX 2.0 Winners
  if (
    q.includes("2.0") &&
    (q.includes("winner") || q.includes("who won") || q.includes("result"))
  ) {
    return `### 🏆 CodeX 2.0 (24 August 2024) Winners
- **1st Prize (₹8,500):** Team **CP Champs** (*Vankam Venkata Durga Prasad, Divite Dinesh*)
- **2nd Prize (₹6,000):** Team **Decoders** (*Papireddy Gari Guna Manisha, Avula Bharath Reddy, Swathi Challa*)
- **3rd Prize (₹4,000):** Team **GPREC1985** (*Gunduboina Dileep, Surya Rudrakshala, Kunchepu Hrushikesavagokulu*)
- **4th Prize (Consolation - ₹2,000):** Team **Bot$$Coders** (*B Thirumaleswar Reddy, Adoni Bhaskar, Pakalwada Riyaz Ahamed*)
- **5th Prize (Consolation - ₹2,000):** Team **Mind Benders** (*Bandla Dora Babu, Jeerla Subash, K G Mahesh*)`;
  }

  // 7. Generic Event Winners Lookup from query / history
  if (q.includes("winner") || q.includes("who won")) {
    const winnerChunk = chunks?.find((c) =>
      (c.text || "").toLowerCase().includes("winner") || (c.text || "").toLowerCase().includes("1st prize")
    );
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

  // 8. Prizes & Perks / Rewards / Sponsors for CodeX 4.0
  if (
    q.includes("prize") ||
    q.includes("perk") ||
    q.includes("reward") ||
    q.includes("cash") ||
    q.includes("sponsor") ||
    q.includes("50,000") ||
    q.includes("50000")
  ) {
    return `### 🏆 CodeX 4.0 Prizes, Perks & Sponsors
- **Prize Pool:** Up to **₹50,000** total prize pool! *(The position-wise split is not published yet in the knowledge base).*
- **Career Opportunity:** Top-winning teams have the opportunity to secure **internships with Technical Sponsor WeDevit** and other leading tech companies.
- **Participant Perks:** Every participant receives goodies, refreshments, and a hard-copy certificate.
- **Sponsors:** **WeDevit** (*Technical Sponsor*), **HaveMore** (*Havmor ice creams*), **Microcare**, **Fiarro Pizza**, and **RC Cola**.`;
  }

  // 9. Eligibility & Team Rules
  if (
    q.includes("eligib") ||
    q.includes("team format") ||
    q.includes("who can") ||
    q.includes("team size") ||
    q.includes("format") ||
    q.includes("4th year") ||
    q.includes("final year") ||
    q.includes("branch") ||
    q.includes("rule")
  ) {
    return `### 👥 CodeX 4.0 Eligibility & Team Rules
- **Eligibility:** Undergraduate engineering students in **II, III, or IV Year** from GPREC and other engineering colleges/universities (*1st-year students are not eligible*).
- **Team Size:** Exactly **2 or 3 members** per team.
- **Final-Year Rule:** Maximum **one 4th-year student** per team (0 or 1). Teams with two or more 4th-year students are not permitted.
- **Same-College Rule:** All members of a team must belong to the **same college**. Cross-branch and inter-year combinations within the same college are allowed and encouraged.
- **Roll Numbers:** Each student's roll number can be registered with only one team.`;
  }

  // 10. Campus Food & Navigation Guide
  if (
    q.includes("food") ||
    q.includes("canteen") ||
    q.includes("cafeteria") ||
    q.includes("csm") ||
    q.includes("lab") ||
    q.includes("map") ||
    q.includes("location") ||
    q.includes("direction")
  ) {
    return `### 📍 GPREC Campus Navigation Guide
- **CSM Computer Labs (CodeX 4.0 Venue):** CSM Block, Ground & 1st Floor. From the Main Gate, walk straight along the central avenue for ~180 meters past the lawn.
- **Main Cafeteria & College Canteen:** South-East zone near the sports ground (~220 meters from Main Gate).
- **Campus Food Court:** Central Amenities Plaza (~250 meters from Main Gate). Offers juice parlors, snacks, and quick bites.
- **Open Air Amphitheatre:** Adjacent to CSM Block courtyard (~160 meters from Main Gate).
*(Tip: You can also tap **Campus Map** in the menu to see interactive routes and GPS markers!)*`;
  }

  // 11. Refund & Cancellation Policy
  if (q.includes("refund") || q.includes("cancel") || q.includes("money back")) {
    return `### 💳 CodeX 4.0 Registration Fee & Refund Policy
- **Standard Policy:** The ₹300 registration fee is **generally non-refundable** after successful payment. There is no refund for voluntary withdrawal, absence, or disqualification.
- **Duplicate / Excess Payments:** A verified duplicate or excess payment caused by a technical issue is refundable to the original payment source.
- **Event Cancellation:** A refund is possible if CodeX 4.0 is completely cancelled without being rescheduled.
- **Team-Member Substitution:** A substitution may be possible before the registration deadline of **23 September 2026** by contacting the organizers.`;
  }

  // 12. Solo / Individual Participation
  if (q.includes("solo") || q.includes("alone") || q.includes("individual") || q.includes("single member") || q.includes("1 member")) {
    return `### 👥 CodeX 4.0 Individual / Solo Participation
- **Policy:** CodeX 4.0 registration is done strictly as a **team** (not individually).
- **Team Size:** Every team must have exactly **2 or 3 members** from the same college. Solo participation is not permitted.`;
  }

  // 13. Programming Languages & Compilers (Explicitly stating what knowledge base publishes)
  if (q.includes("language") || q.includes("c++") || q.includes("java") || q.includes("python") || q.includes("c lang") || q.includes("compiler")) {
    return `### 💻 Programming Languages for CodeX 4.0
- **Status:** The specific allowed programming languages and problem topics have **not been published** in the official knowledge base yet.
- **Contact Organizers:** For details on supported languages and compiler versions, please contact the student coordinators listed in the contacts section (Tabraiz, Kashif, or Karthik Sai).`;
  }

  // 14. Date / Timing / Venue / Schedule / Rounds
  if (
    q.includes("when") ||
    (q.includes("date") && !q.includes("last")) ||
    q.includes("timing") ||
    q.includes("schedule") ||
    q.includes("round") ||
    q.includes("where is codex")
  ) {
    return `### 📅 CodeX 4.0 Schedule & Competition Rounds
- **Date:** 24 September 2026
- **Reporting Time:** 8:30 AM to 9:00 AM IST (bring physical College ID, Team ID/confirmation email, and CodeX 4.0 Pass).
- **Event Window:** 9:00 AM to 5:00 PM IST (includes Round 1, Round 2, guest speaker session, and valedictory ceremony).
- **Venue:** CSM Computer Labs, GPREC Campus, Nandyal Road, Kurnool.
- **Structure:** Exactly **two competition rounds**:
  - **Round 1 (Preliminary Round):** All registered teams participate; scores determine qualifiers.
  - **Round 2 (Grand Finale):** Top-performing teams from Round 1 compete for prizes.
- *Note: Exact round durations, clock timings, break times, and problem topics are not published in this knowledge base; contact the organizers for updates.*`;
  }

  // 15. Registration & Fee
  if (
    q.includes("register") ||
    q.includes("registration") ||
    q.includes("fee") ||
    q.includes("cost") ||
    q.includes("pay") ||
    q.includes("price") ||
    q.includes("portal") ||
    q.includes("link") ||
    q.includes("300")
  ) {
    return `### 📝 CodeX 4.0 Registration & Fees
- **Registration Fee:** **₹300 per team** (flat fee for the whole team, covering 2 to 3 members).
- **Registration Deadline:** **23 September 2026**.
- **Registration Portal:** [https://codex4-0-registration-portal.codersclubgprec.in](https://codex4-0-registration-portal.codersclubgprec.in)
- **Payment Method:** Processed securely through Cashfree Payments (UPI, debit card, credit card, net banking).
- **Pass & Verification:** Generates a unique Team ID (e.g., \`CDX4-0001\`). Download the CodeX 4.0 Pass to bring on the event day.`;
  }

  // 16. Guest Speaker
  if (q.includes("speaker") || q.includes("nihar") || q.includes("guest")) {
    return `### 🎙️ CodeX 4.0 Guest Speaker — Dodagatta Nihar
- **Guest Speaker:** **Dodagatta Nihar**
- **Profile:** Tech Educator, Web Developer, ML Engineer, Entrepreneur, and 3x TEDx Speaker with 500K+ Instagram followers.
- **Known For:** Making coding and technology accessible through regional-language content (primarily Telugu), founder of MassCoders and working on Codedale.
- *Session:* Interactive keynote offering practical tech learning perspectives and career inspiration. *(Exact time and duration are not published yet).*`;
  }

  // 17. Team & Contact details
  if (
    q.includes("team") ||
    q.includes("contact") ||
    q.includes("coordinator") ||
    q.includes("phone") ||
    q.includes("email") ||
    q.includes("number") ||
    q.includes("/team")
  ) {
    return `### 📞 Coders' Club & CodeX 4.0 Contacts
- **Faculty Convener:** Dr. A. Vishnuvardhan Reddy (Associate Professor, ECS, GPREC)
- **Faculty Coordinators:** Sri P. Rama Rao (CSE), Sri V. Mallesi (CSE), Dr. R. Sudheer Babu (ECE), Dr. S. Anil Kumar (EEE)
- **Student Contacts for CodeX 4.0:**
  - **Tabraiz (SMD Tabraiz, CSD):** +91 9391491123
  - **Kashif (Mohammed Kashif, CSD):** +91 9492068097
  - **Karthik Sai (Vinjamarla Karthik Sai, ECE):** +91 9032174306
- **Email:** \`codersclub@gprec.ac.in\`
- **Instagram:** [@coders_club_gprec](https://instagram.com/coders_club_gprec)
- **Support Hours:** Mon–Sat, 9:00 AM – 7:00 PM IST (Typical response time: 12–24 hours).`;
  }

  // 18. Exact FAQ or section extraction from retrieved chunks
  const exactMatch = extractExactAnswerFromChunks(query, chunks);
  if (exactMatch) {
    return exactMatch;
  }

  // 19. Clean Content Extraction from Top Chunk if score is relevant
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

  // 20. Honest "I don't know" fallback
  return "I don't have enough specific information on that in my knowledge base. For further details, feel free to reach out to the Coders' Club coordinators directly at codersclub@gprec.ac.in or contact student leads Tabraiz (+91 9391491123), Kashif (+91 9492068097), or Karthik Sai (+91 9032174306).";
}
