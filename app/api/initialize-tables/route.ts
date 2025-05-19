import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Erstelle die player_settings-Tabelle
    const { error: settingsError } = await supabase.sql`
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

    if (settingsError) {
      console.error("Fehler beim Erstellen der player_settings-Tabelle:", settingsError)
      return NextResponse.json({ error: "Fehler beim Erstellen der player_settings-Tabelle" }, { status: 500 })
    }

    // Erstelle die bans-Tabelle
    const { error: bansError } = await supabase.sql`
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

    if (bansError) {
      console.error("Fehler beim Erstellen der bans-Tabelle:", bansError)
      return NextResponse.json({ error: "Fehler beim Erstellen der bans-Tabelle" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Tabellen erfolgreich initialisiert",
    })
  } catch (error) {
    console.error("Fehler bei der Tabelleninitialisierung:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
