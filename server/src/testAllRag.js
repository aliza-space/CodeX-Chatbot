import app from "./app.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

async function parseSSEStream(res) {
  const text = await res.text();
  const lines = text.split("\n");
  let fullAnswer = "";
  let meta = null;
  let finalData = null;

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.token) fullAnswer += payload.token;
        if (payload.conversationId) meta = payload;
        if (payload.citations) finalData = payload;
      } catch {}
    }
  }

  return {
    answer: fullAnswer.trim(),
    meta,
    finalData,
  };
}

async function testAll() {
  await connectDB();
  const server = app.listen(0);
  const port = server.address().port;
  console.log(`Test API Server running on port ${port}\n`);

  const testSuite = [
    { q: "What is CodeX?", desc: "Event Overview" },
    { q: "What is the date of CodeX 4.0?", desc: "Event Date & Timing" },
    { q: "What are the rules for team size?", desc: "Team Size Rule" },
    { q: "Can 4th year students participate?", desc: "4th Year Rule" },
    { q: "Can 1st year students participate?", desc: "1st Year Rule" },
    { q: "iam 1st yr can ijoin?", desc: "1st Year Typo Query" },
    { q: "What is the registration fee for CodeX 4.0?", desc: "Registration Fee" },
    { q: "How do I register?", desc: "Registration Process" },
    { q: "Who is the guest speaker?", desc: "Guest Speaker" },
    { q: "Who is Dodagatta Nihar?", desc: "Speaker Profile" },
    { q: "What are the prizes for CodeX 4.0?", desc: "Prize Pool & Perks" },
    { q: "Who are the sponsors?", desc: "Event Sponsors" },
    { q: "Who is the faculty convener?", desc: "Faculty Convener" },
    { q: "Who are the student coordinators?", desc: "Student Coordinators & Contacts" },
    { q: "Where is the venue?", desc: "Venue Location" },
    { q: "Where is the cafeteria?", desc: "Cafeteria Navigation" },
    { q: "Where is the food court?", desc: "Food Court Navigation" },
    { q: "How to reach GPREC from railway station?", desc: "Campus Reachability" },
    { q: "Who won Galactic Gamble?", desc: "Galactic Gamble Winners" },
    { q: "Who won CodeX 3.0?", desc: "CodeX 3.0 Winners" },
    { q: "Who won CodeX 2.0?", desc: "CodeX 2.0 Winners" },
    { q: "What was IdeaSprint?", desc: "IdeaSprint Past Event" },
    { q: "What was OUTSYSLAYER?", desc: "OUTSYSLAYER Hackathon" },
    { q: "What was Code Symposium?", desc: "Code Symposium Series" },
    { q: "What is Jignasa?", desc: "Jignasa Website" },
    { q: "What is the official website of Coders Club?", desc: "Club Website" },
    { q: "Is the fee refundable?", desc: "Refund Policy" },
    { q: "Can I change a team member?", desc: "Member Substitution" },
    { q: "What should I bring on event day?", desc: "What to Bring" },
    { q: "How many rounds does CodeX 4.0 have?", desc: "Competition Rounds" },
    { q: "What are the learning activities of the club?", desc: "Learning Activities" },
    { q: "How do I join Coders Club?", desc: "Club Membership" },
  ];

  let passed = 0;
  for (let i = 0; i < testSuite.length; i++) {
    const { q, desc } = testSuite[i];
    const res = await fetch(`http://localhost:${port}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, guestSessionId: `test-session-${i}` }),
    });

    const result = await parseSSEStream(res);
    const hasAnswer = result.answer && result.answer.length > 20;
    const hasCitations = result.finalData?.citations?.length > 0;
    const isOk = res.status === 200 && hasAnswer;

    if (isOk) passed++;
    console.log(`[${i + 1}/${testSuite.length}] ${desc}: "${q}" -> ${isOk ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Preview: ${result.answer.slice(0, 120).replace(/\n/g, " ")}...\n`);
  }

  console.log(`\n========================================`);
  console.log(`FINAL RESULT: ${passed}/${testSuite.length} PASSED`);
  console.log(`========================================\n`);

  server.close();
  await mongoose.disconnect();
}

testAll().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
