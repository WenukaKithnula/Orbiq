import { createClient } from '@supabase/supabase-js';

// The one Supabase client instance used everywhere in the app.
// All actual signup/login/logout calls go through this, never through our own backend.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
