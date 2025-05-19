import { createClient } from "@supabase/supabase-js"

// Für serverseitige Aufrufe
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vefhpdjiqxugnykucfep.supabase.co"
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZmhwZGppcXh1Z255a3VjZmVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwNTg3MywiZXhwIjoyMDYyOTgxODczfQ.uopBjNwEf27Qfi-vW4tLLNEHqBDp0Lq0OiVeM2TSsvU"
  return createClient(supabaseUrl, supabaseKey)
}

// Für clientseitige Aufrufe (Singleton-Pattern)
let clientSupabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseInstance) return clientSupabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vefhpdjiqxugnykucfep.supabase.co"
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  clientSupabaseInstance = createClient(supabaseUrl, supabaseKey)
  return clientSupabaseInstance
}
