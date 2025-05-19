import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Prüfen, ob die Tabelle existiert und löschen, falls ja
    const { error: dropError } = await supabase.sql`
      DROP TABLE IF EXISTS public.bans;
    `

    if (dropError) {
      console.error("Fehler beim Löschen der alten Bann-Tabelle:", dropError)
      return NextResponse.json({ error: "Fehler beim Löschen der alten Bann-Tabelle" }, { status: 500 })
    }

    // Direkte SQL-Ausführung, um die Tabelle neu zu erstellen
    const { error } = await supabase.sql`
      CREATE TABLE public.bans (
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
