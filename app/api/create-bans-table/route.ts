import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Direkte SQL-Ausführung, um die Tabelle zu erstellen
    const { error } = await supabase.sql(`
      -- Prüfe, ob die Tabelle bereits existiert
      CREATE TABLE IF NOT EXISTS public.bans (
        id SERIAL PRIMARY KEY,
        uuid TEXT, -- Explizit als TEXT definiert, nicht UUID
        username TEXT NOT NULL,
        reason TEXT NOT NULL,
        banned_by TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        duration_minutes INTEGER DEFAULT 0,
        source TEXT DEFAULT 'web',
        active BOOLEAN DEFAULT true
      );
      
      -- Erstelle Indizes für schnellere Abfragen
      CREATE INDEX IF NOT EXISTS idx_bans_username ON public.bans(username);
      CREATE INDEX IF NOT EXISTS idx_bans_uuid ON public.bans(uuid);
      CREATE INDEX IF NOT EXISTS idx_bans_active ON public.bans(active);
    `)

    if (error) {
      console.error("Fehler beim Erstellen der Bann-Tabelle:", error)
      return NextResponse.json({ error: "Fehler beim Erstellen der Bann-Tabelle: " + error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Bann-Tabelle erfolgreich erstellt",
    })
  } catch (error) {
    console.error("Fehler beim Erstellen der Bann-Tabelle:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
