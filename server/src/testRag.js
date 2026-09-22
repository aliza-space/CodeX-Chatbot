import { connectDB } from "./config/db.js";
import { runRagPipeline } from "./services/rag/ragPipeline.js";
import mongoose from "mongoose";

async function test() {
  await connectDB();
  console.log("Connected to DB successfully.\n");

  const testCases = [
    {
      label: "1. Eligibility & Team Rules for CodeX 4.0",
      query: "What are the eligibility rules and team format for CodeX 4.0?",
      history: [],
    },
    {
      label: "2. Prizes and Perks for CodeX 4.0",
      query: "What are the prizes and perks for CodeX 4.0?",
      history: [],
    },
    {
      label: "3. Typo query: iam 1st yr can ijoin?",
      query: "iam 1st yr can ijoin?",
      history: [],
    },
    {
      label: "4. Learning resources",
      query: "Show me learning resources",
      history: [],
    },
    {
      label: "5. Upcoming events",
      query: "What events are coming up?",
      history: [],
    },
    {
      label: "6. Follow-up query: winners ?? after Galactic Gamble",
      query: "winners ??",
      history: [
        { role: "user", content: "Tell me about Galactic Gamble" },
        { role: "assistant", content: "Galactic Gamble was a 2-round technical competition held on 3 Jan 2026." },
      ],
    },
    {
      label: "7. FAQ: Is the registration fee refundable?",
      query: "Is the registration fee refundable?",
      history: [],
    },
    {
      label: "8. Campus Navigation: Where is the food court and CSM labs?",
      query: "Where is the food court and CSM labs?",
      history: [],
    },
    {
      label: "9. Guest Speaker: Who is the speaker?",
      query: "Who is the guest speaker for CodeX 4.0?",
      history: [],
    },
    {
      label: "10. Contact Info: Coordinator phone numbers",
      query: "How do I contact the coordinators?",
      history: [],
    },
  ];

  for (const tc of testCases) {
    console.log("=".repeat(60));
    console.log(`TEST: ${tc.label}`);
    console.log(`User Query: "${tc.query}"`);
    const result = await runRagPipeline({
      userMessage: tc.query,
      history: tc.history,
    });
    console.log(`Rewritten Query: ${result.rewrittenQuery}`);
    console.log("Answer:\n" + result.answer);
    console.log(`Citations: ${result.citations.map((c) => c.title).join(", ")}`);
    console.log(`Suggestions: ${result.suggestions.join(" | ")}`);
    console.log("=".repeat(60) + "\n");
  }

  await mongoose.disconnect();
}

test().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
