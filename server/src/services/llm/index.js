import { env } from "../../config/env.js";
import * as gemini from "./gemini.js";
import * as openai from "./openai.js";
import * as anthropic from "./anthropic.js";

// Every provider module exports:
//   streamChat({ systemPrompt, messages, onToken }) -> Promise<string full text>
//   complete({ systemPrompt, messages }) -> Promise<string>
// messages: [{ role: "user"|"assistant", content: string }]

const providers = { gemini, openai, anthropic };

export function getLLM(providerName = env.LLM_PROVIDER) {
  const provider = providers[providerName];
  if (!provider) throw new Error(`Unknown LLM provider: ${providerName}`);
  return provider;
}
