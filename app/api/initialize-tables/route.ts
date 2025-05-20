import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create player_settings table
    const createPlayerSettingsTable = `
      CREATE TABLE IF NOT EXISTS public.player_settings (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        pvp_enabled BOOLEAN DEFAULT false,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_player_settings_username ON public.player_settings(username);
    `

    const { error: settingsError } = await supabase
      .from('_supabase_schema')
      .select('*')
      .then(async () => {
        return await supabase.rpc('exec_sql', { query: createPlayerSettingsTable })
      })

    if (settingsError) {
      console.error("Error creating player_settings table:", settingsError)
      return NextResponse.json({ error: "Error creating player_settings table" }, { status: 500 })
    }

    // Create bans table
    const createBansTable = `
      CREATE TABLE IF NOT EXISTS public.bans (
        id SERIAL PRIMARY KEY,
        uuid TEXT,
        username TEXT NOT NULL,
        reason TEXT NOT NULL,
        banned_by TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        duration_minutes INTEGER DEFAULT 0,
        source TEXT DEFAULT 'web',
        active BOOLEAN DEFAULT true
      );
      
      CREATE INDEX IF NOT EXISTS idx_bans_username ON public.bans(username);
      CREATE INDEX IF NOT EXISTS idx_bans_uuid ON public.bans(uuid);
      CREATE INDEX IF NOT EXISTS idx_bans_active ON public.bans(active);
    `

    const { error: bansError } = await supabase
      .from('_supabase_schema')
      .select('*')
      .then(async () => {
        return await supabase.rpc('exec_sql', { query: createBansTable })
      })

    if (bansError) {
      console.error("Error creating bans table:", bansError)
      return NextResponse.json({ error: "Error creating bans table" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Tables successfully initialized",
    })
  } catch (error) {
    console.error("Error during table initialization:", error)
    return NextResponse.json(
      { error: "An error occurred: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}