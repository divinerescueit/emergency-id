import { createClient } from '@supabase/supabase-js';

// SERVER-SIDE ONLY. Never import this file into a component that runs
// in the browser -- it uses the service_role key, which has full
// access to the database and bypasses Row Level Security.
//
// Safe to use in:
//   - pages/api/*.js   (API routes)
//   - getServerSideProps
//
// NOT safe to use in:
//   - regular React components
//   - anything bundled for the client

let supabaseAdmin;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error(
        'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      );
    }

    supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseAdmin;
}
