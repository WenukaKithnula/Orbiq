# Project Architecture

## Stack
- **Frontend**: React + Vite (`client/`), React Router for routing, axios for HTTP calls to the backend.
- **Backend**: Node.js + Express (`server/`), all application/business logic lives here.
- **Database**: Postgres, accessed only from the Node.js backend via `pg` (`server/src/db/pool.js`). This may be Supabase's hosted Postgres instance or a self-managed one — either way, it's reached with a direct `DATABASE_URL` connection string, never through the Supabase client SDK.
- **Auth**: Supabase Auth only (signup/login/logout/session, `supabase.auth.*`). Supabase is not used for data storage/queries from the client, Realtime, Storage, or Edge Functions.

## How auth flows into the backend
1. Client authenticates via `supabase.auth.*` (see `client/src/lib/supabaseClient.js`, `client/src/context/AuthContext.jsx`). Supabase issues a JWT.
2. Every request to the Node backend goes through `client/src/lib/apiClient.js` (axios instance), which attaches that JWT as `Authorization: Bearer <token>`.
3. The Express backend verifies the JWT itself against the project's public signing keys, fetched from Supabase's JWKS endpoint (`SUPABASE_URL`, `server/src/middleware/verifySupabaseAuth.js`) — no per-request round trip to Supabase's API needed, since `jose` caches the keys. On success it sets `req.authId` (the Supabase user's UUID, from the JWT's `sub` claim).
4. Controllers (`server/src/controllers/`) use `req.authId` to scope all Postgres queries to the current user.

## Conventions for new features
- New data/business logic → new route + controller in `server/src/routes` / `server/src/controllers`, protected by `verifySupabaseAuth`, querying Postgres via `server/src/db/pool.js`.
- New frontend calls → add a method to the `api` object in `client/src/lib/apiClient.js`; never call axios/fetch directly from components.
- Do not add `supabase.from(...)` data queries, Supabase Storage, or Supabase Realtime — data always goes through the Node.js backend.
