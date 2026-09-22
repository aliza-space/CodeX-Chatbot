import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.string().default("development"),
  CLIENT_URL: z.string().default("http://localhost:5173"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  VECTOR_INDEX_NAME: z.string().default("chunk_vector_index"),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be set and reasonably long"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  LLM_PROVIDER: z.enum(["gemini", "openai", "anthropic"]).default("gemini"),
  LLM_MODEL: z.string().default("gemini-3.6-flash"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  EMBEDDING_PROVIDER: z.enum(["gemini", "openai"]).default("gemini"),
  EMBEDDING_MODEL: z.string().default("gemini-embedding-001"),
  EMBEDDING_DIMENSIONS: z.string().default("768"),

  RAG_TOP_K: z.string().default("5"),
  RAG_MIN_SCORE: z.string().default("0.72"),
  CHUNK_TOKENS: z.string().default("500"),
  CHUNK_OVERLAP: z.string().default("50"),

  KB_SOURCE_DIR: z.string().default("../knowledge-base"),

  RATE_LIMIT_WINDOW_MS: z.string().default("60000"),
  RATE_LIMIT_MAX: z.string().default("30"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

export const env = {
  ...raw,
  PORT: Number(raw.PORT),
  EMBEDDING_DIMENSIONS: Number(raw.EMBEDDING_DIMENSIONS),
  RAG_TOP_K: Number(raw.RAG_TOP_K),
  RAG_MIN_SCORE: Number(raw.RAG_MIN_SCORE),
  CHUNK_TOKENS: Number(raw.CHUNK_TOKENS),
  CHUNK_OVERLAP: Number(raw.CHUNK_OVERLAP),
  RATE_LIMIT_WINDOW_MS: Number(raw.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: Number(raw.RATE_LIMIT_MAX),
  isProd: raw.NODE_ENV === "production",
};
