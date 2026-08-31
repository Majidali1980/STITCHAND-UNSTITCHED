# Base44 Dev Environment

## App Overview
"Stitch & Unstitched" — a premium Pakistani fashion e-commerce storefront + admin CMS.
Stack: React 19 + Vite 6 + Express, TypeScript, Tailwind CSS v4. Single-origin: one Express server (server.ts) serves both the REST API (`/api/*`) and the Vite dev middleware (frontend) on port 3000.

## Architecture
- **server.ts** — Express app with all REST endpoints + Vite middleware in dev mode. Entry point run via `tsx`.
- **server/db.ts** — in-memory database with seed data (products, categories, orders, coupons, CMS pages, etc.). No external database; state resets on server restart.
- **src/** — React frontend. `src/services/api.ts` is the API client (calls same-origin `/api/*`).
- **AI features** — `/api/ai/stylist` and `/api/ai/suggest-product-details` use `@google/genai` (Gemini). They have graceful static fallbacks when `GEMINI_API_KEY` is absent.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- Image: `node:22-slim`, repo bind-mounted at `/app`.
- Startup: `npm install && npx tsx watch server.ts` (server-side live reload via tsx watch; frontend HMR via Vite).
- Web entry: http://localhost:3000 (host port 3000).

## Verification
- `curl -sf http://localhost:3000/` → HTTP 200 (HTML)
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` → HTTP 200 (allowedHosts enabled)
- `curl -sf http://localhost:3000/api/products?limit=2` → JSON product list
- `curl -sf http://localhost:3000/src/main.tsx` → served live TS source (confirms dev mode, not prebuilt)

## Secrets
- `GEMINI_API_KEY` (optional) — Google Gemini API key for AI stylist/product copy features. App boots and works without it (static fallback). Obtain from Google AI Studio.
- Delivered via `/run/base44/app.env`; placeholder defaults in `.env.base44-defaults`.

## Notes
- `vite.config.ts` has `server.host: true` and `server.allowedHosts: true` so the preview's external hostname is accepted.
- No database service needed — all data is in-memory in `server/db.ts`.
- `DISABLE_HMR` env var (from original AI Studio setup) disables Vite HMR/watch; not set here so HMR stays active.
