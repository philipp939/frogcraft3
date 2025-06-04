import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client für Browser/Frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client für Server/Backend
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Für serverseitige Aufrufe
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Für clientseitige Aufrufe (Singleton-Pattern)
let clientSupabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseInstance) return clientSupabaseInstance
  clientSupabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientSupabaseInstance
}

export default supabase
