import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // SQL zum Erstellen der Tabelle
    const { error } = await supabase.rpc("create_player_settings_table")

    if (error) {
      console.error("Fehler beim Erstellen der Tabellen:", error)
      throw error
    }

    return NextResponse.json({
      message: "Tabellen erfolgreich erstellt",
    })
  } catch (error) {
    console.error("Fehler beim Erstellen der Tabellen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
