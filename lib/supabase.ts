import { createClient } from "@supabase/supabase-js"

// Für serverseitige Aufrufe
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return createClient(supabaseUrl, supabaseKey)
}

// Für clientseitige Aufrufe (Singleton-Pattern)
let clientSupabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseInstance) return clientSupabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  clientSupabaseInstance = createClient(supabaseUrl, supabaseKey)
  return clientSupabaseInstance
}
