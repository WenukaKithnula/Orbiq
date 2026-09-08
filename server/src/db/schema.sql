-- Run this once against your Postgres database (Supabase's built-in Postgres,
-- or your own, per your earlier choice) before starting the server.

CREATE TABLE IF NOT EXISTS app_user_data (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name     TEXT NOT NULL,
    username      TEXT NOT NULL UNIQUE,
    timezone      TEXT,
    purpose       TEXT,
    categories    JSONB,
    avatar_url    TEXT,
    onboarding_completed BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_app_user_data_auth_id ON app_user_data(auth_id);

-- Workspaces: user-created containers shown in the sidebar (School/Work/etc.).
-- One user can have many; soft-deleted rows (deleted_at set) power a Trash view
-- instead of being hard-deleted.
CREATE TABLE IF NOT EXISTS workspaces (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    icon        TEXT,
    position    INTEGER DEFAULT 0,        -- controls sidebar ordering
    deleted_at  TIMESTAMPTZ,              -- soft delete, powers the Trash feature
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspaces_auth_id ON workspaces(auth_id);
