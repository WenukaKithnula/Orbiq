# Phase 1 \u2014 Auth, Profile, Dashboard

Landing \u2192 Sign Up / Log In (Supabase Auth) \u2192 Complete Profile (new users only) \u2192 Dashboard.

## How it fits together

- **Supabase** handles all actual authentication (signup, login, logout, password
  hashing, session/JWT issuance). The frontend talks to Supabase directly for this
  via `@supabase/supabase-js` \u2014 your own backend is never involved in it.
- **Your Node backend** owns application data only. It never issues or checks
  passwords \u2014 it just verifies the JWT Supabase already issued, and uses the
  user ID inside it (`req.authId`) to read/write that user's own data.
- **PostgreSQL** stores your app's own tables (starting with `app_user_data`),
  each row linked back to a Supabase auth user by `auth_id`.

## Setup

### 1. Database
Run `server/src/db/schema.sql` against your Postgres database.

### 2. Backend
```
cd server
cp .env.example .env      # fill in DATABASE_URL and SUPABASE_JWT_SECRET
npm install
npm run dev                # starts on http://localhost:4000
```
`SUPABASE_JWT_SECRET` is found in your Supabase project settings under
API \u2192 JWT Settings.

### 3. Frontend
```
cd client
cp .env.example .env      # fill in your Supabase project URL + anon key
npm install
npm run dev                # starts on http://localhost:5173
```

## Request flow, in one sentence

Frontend authenticates directly with Supabase \u2192 attaches the resulting JWT to
every call made to your backend \u2192 backend's `verifySupabaseAuth` middleware
verifies that token and sets `req.authId` \u2192 every controller uses `req.authId`
to know whose data it's reading or writing \u2014 never anything sent by the client.

## What's next (not yet built)

- Tasks, Workspaces, and every other resource follow the exact same CRUD pattern
  already used for `app_user_data` \u2014 see the CRUD Flow document for the full
  walkthrough.
- Password reset flow
- Rate limiting on auth-adjacent routes
