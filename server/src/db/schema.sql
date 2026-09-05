-- Run this once against your Postgres database (Supabase's built-in Postgres,
-- or your own, per your earlier choice) before starting the server.

CREATE TABLE IF NOT EXISTS app_user_data (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id       UUID NOT NULL UNIQUE,     
    full_name     TEXT NOT NULL,
    username      TEXT NOT NULL UNIQUE,
    timezone      TEXT,
    avatar_url    TEXT,
    onboarding_completed BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_app_user_data_auth_id ON app_user_data(auth_id);
