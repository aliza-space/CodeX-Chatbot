# Architecture — Coders' Club GPREC Chatbot (CodeBuddy)

## High-level diagram

```mermaid
flowchart TB
    subgraph Client [React Client]
        UI[Chat UI: widget + full page]
        Admin[Admin Dashboard]
    end

    subgraph API [Express API]
        Auth[Auth: JWT]
        ChatEP["/api/chat (SSE)"]
        DocsEP["/api/admin/documents"]
        AnalyticsEP["/api/admin/analytics"]
    end

    subgraph RAG [RAG Pipeline]
        Rewrite[Query Rewriter]
        Retrieve["Retriever ($vectorSearch + filters)"]
        Rerank[Reranker: score threshold + dedupe]
        Prompt[Prompt Builder + Citations]
    end

    subgraph Data [MongoDB Atlas]
        Docs[(Document)]
        Chunks[(Chunk + embedding, vector index)]
        Convo[(Conversation / Message)]
        Unanswered[(UnansweredQuery)]
    end

    subgraph LLM [Pluggable LLM Provider]
        Gemini
        OpenAI
        Anthropic
    end

    UI -->|POST /api/chat| ChatEP
    Admin --> DocsEP
    Admin --> AnalyticsEP

    ChatEP --> Rewrite --> Retrieve --> Rerank --> Prompt --> LLM
    Retrieve <--> Chunks
    Prompt -->|stream tokens (SSE)| UI
    ChatEP --> Convo
    Rerank -->|below threshold| Unanswered

    DocsEP -->|parse, chunk, embed| Chunks
    DocsEP --> Docs
```

## Data flow of one chat turn

1. User sends a message (or slash command) from the widget/full page.
2. API creates/loads the `Conversation`, saves the user `Message`.
3. **Query rewriter**: if the message looks like a follow-up ("what about its prize?"),
   the last ~6 turns are sent to the LLM to produce a standalone query.
4. **Retriever**: the standalone query is embedded, then `$vectorSearch` runs against
   the `chunks` collection (Atlas Vector Search), optionally pre-filtered by
   category/tags/status (e.g. a `/events` command filters to `category: "event"`).
5. **Reranker**: chunks below `RAG_MIN_SCORE` are dropped; remaining chunks are
   deduped and capped to `RAG_TOP_K`.
6. **Prompt builder**: surviving chunks become the `CONTEXT` block, each tagged
   with its source title so the model can cite it.
7. **Generation**: the system prompt (persona + grounding rules + context +
   live announcements) plus recent conversation history go to the active LLM
   provider, which streams tokens back over SSE.
8. If no chunk passed the threshold, the turn is logged to `UnansweredQuery`
   for the admin dashboard, and the model is instructed to say so honestly.
9. The assistant `Message` (with citations) is saved; suggestion chips are
   derived from the top retrieved category.

## Ingestion flow (admin panel / CLI)

1. Admin uploads a `.md/.txt/.pdf/.docx` file (or the CLI walks `knowledge-base/`).
2. `parser.js` extracts title/category/tags/date from the file (matches the
   `**Category:** / **Date:** / **Tags:**` convention used in your knowledge base).
3. `chunker.js` splits on `##` section headings first, then packs into
   ~500-token windows with 50-token overlap, prefixing every chunk with the
   document title so entity references survive retrieval in isolation.
4. Each chunk is embedded and stored in the `chunks` collection alongside
   denormalized metadata (category/tags/status) for filtering.
5. The parent `Document` record is updated with `chunkCount` and `lastIndexedAt`.
