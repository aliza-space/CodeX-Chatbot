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
    if (line.startsWith("event: token")) {
      // next data line has token
    } else if (line.startsWith("data: ")) {
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

async function runApiTests() {
  await connectDB();
  const server = app.listen(0);
  const port = server.address().port;
  console.log(`Test API Server running on port ${port}\n`);

  const queries = [
    "what is codex",
    "What are the eligibility rules and team format for CodeX 4.0?",
    "What are the prizes and perks for CodeX 4.0?",
    "iam 1st yr can ijoin?",
    "Show me learning resources",
    "What events are coming up?",
    "Who won Galactic Gamble?",
    "Who won CodeX 3.0?",
    "Who won CodeX 2.0?",
    "Is the registration fee refundable?",
    "Who is the guest speaker for CodeX 4.0?",
    "Where is the food court and CSM labs?",
    "How do I contact the coordinators?",
  ];

  for (const q of queries) {
    console.log("=".repeat(70));
    console.log(`API REQUEST: "${q}"`);
    const res = await fetch(`http://localhost:${port}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, guestSessionId: "test-guest" }),
    });

    console.log(`HTTP STATUS: ${res.status}`);
    const result = await parseSSEStream(res);
    console.log("RESPONSE ANSWER:\n" + result.answer);
    if (result.finalData?.citations) {
      console.log(
        `CITATIONS (${result.finalData.citations.length}): ${result.finalData.citations
          .map((c) => c.title || c.documentTitle)
          .join(" | ")}`
      );
    }
    if (result.finalData?.suggestions) {
      console.log(`SUGGESTIONS: ${result.finalData.suggestions.join(" | ")}`);
    }
    console.log("=".repeat(70) + "\n");
  }

  server.close();
  await mongoose.disconnect();
}

runApiTests().catch((err) => {
  console.error("API test error:", err);
  process.exit(1);
});
