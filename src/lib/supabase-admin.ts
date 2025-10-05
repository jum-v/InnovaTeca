import { createClient } from '@supabase/supabase-js'

// Use SUPABASE_SERVICE_ROLE_KEY (server-side only, not PUBLIC)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key (server-only, never expose to client)
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    db: {
      schema: 'public'
    }
  }
)
