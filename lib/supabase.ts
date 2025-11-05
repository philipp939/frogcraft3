import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ovttnumbnvsmelwwvjgz.supabase.co"
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dHRudW1ibnZzbWVsd3d2amd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NjAzOCwiZXhwIjoyMDc3NzcyMDM4fQ.Jg6uQNOSZhmjD6L5KetSahqR3jHSdxrZPPbK8xOh_L8"

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase configuration")
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
