# Setup & Deployment Guide

## 1. Local setup (backend only — Phase 1)

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — create a free MongoDB Atlas cluster, get the connection string
- `GEMINI_API_KEY` — get a free key at https://aistudio.google.com/app/apikey (default provider)
- `JWT_SECRET` — any long random string

## 2. Create the Atlas Vector Search index

The `knowledge-base/` folder (your actual club data) is already bundled at the
project root, and `KB_SOURCE_DIR=../knowledge-base` in `.env.example` points at it.

1. In Atlas, open your cluster → **Search** tab → **Create Search Index**.
2. Choose **JSON Editor**, select the `chunks` collection (created automatically
   on first ingestion), and paste the contents of `docs/atlas-vector-index.json`.
3. Name it `chunk_vector_index` (must match `VECTOR_INDEX_NAME` in `.env`).
4. Wait for it to build (a few minutes on a free tier).

> If you're only testing locally before Atlas Search is ready, the retriever
> falls back to `retrieveChunksFallback` (in-memory cosine similarity) — swap
> the import in `ragPipeline.js` temporarily if needed.

## 3. Seed the database

```bash
npm run seed        # creates an admin user + sample announcement
npm run ingest       # walks knowledge-base/ and embeds every .md file into Chunks
```

Default admin login: `admin@codersclub.gprec.ac.in` / `ChangeMe123!` — **change
this password immediately** (there's no "change password" endpoint yet; update
directly in Mongo Atlas or add one before going live).

## 4. Run the API

```bash
npm run dev     # nodemon, http://localhost:5000
```

Test with curl:
```bash
curl -N -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is CodeX 4.0?", "guestSessionId": "test-session-1"}'
```
You should see `event: token` lines streaming in, then `event: final` with citations.

## 5. Postman testing (recommended before building the frontend)

- Import the routes: `/api/chat`, `/api/auth/register`, `/api/auth/login`,
  `/api/admin/documents/upload`, `/api/admin/analytics`, `/api/feedback`.
- For SSE in Postman: use "Send" with response streaming enabled, or use curl
  with `-N` as above — Postman's UI doesn't render SSE as nicely as curl.
- Register an admin account via `/api/auth/register`, then manually set its
  `role` to `admin` in Atlas (no self-serve promotion endpoint by design).

## 6. Deployment

### API → Render or Railway
1. Push `server/` to a GitHub repo (or the whole monorepo with a root
   directory setting pointed at `server/`).
2. New Web Service → connect repo → build command `npm install`, start
   command `npm start`.
3. Add all `.env` variables in the platform's environment settings.
4. Set `CLIENT_URL` to your deployed frontend's URL once you have it.

### Client → Vercel (once the React frontend is built — Phase 2)
1. Import the `client/` folder as a Vercel project.
2. Set `VITE_API_URL` to your deployed API's URL.
3. Deploy.

## 7. Adding new knowledge later

Two ways:
- **Admin panel** (once built): upload a `.md/.pdf/.docx` → auto-parsed,
  chunked, embedded, indexed immediately.
- **CLI**: drop a new `.md` file into `knowledge-base/<category>/`, following
  the existing `**Category:** / **Date:** / **Tags:**` format, then re-run
  `npm run ingest` (it's safe to re-run — it upserts by file path and replaces
  old chunks for changed files).
