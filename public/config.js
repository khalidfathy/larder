/*
 * Larder cloud sync configuration.
 *
 * Fill these in with your Supabase project's values to sync your data across
 * devices. Find them in the Supabase dashboard under:
 *   Project Settings → API  →  "Project URL" and "Project API keys → anon public"
 *
 * The anon/public key is DESIGNED to be visible in the browser — your data is
 * protected by Row Level Security (see supabase/schema.sql), so each account can
 * only ever read or write its own row.
 *
 * Leave both blank to run the app in local-only mode (data stays on this device).
 */
window.LARDER_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: ""
};
