import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Benutzername erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Prüfe, ob die Tabelle existiert
    const { error: tableCheckError } = await supabase.from("player_settings").select("count(*)").limit(1)

    if (tableCheckError) {
      // Wenn die Tabelle nicht existiert, gib Standardwerte zurück
      return NextResponse.json({
        settings: { username: username.toLowerCase(), pvp_enabled: false },
      })
    }

    // Spielereinstellungen abrufen
    const { data, error } = await supabase
      .from("player_settings")
      .select("*")
      .eq("username", username.toLowerCase())
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 bedeutet "Kein Ergebnis gefunden"
      throw error
    }

    return NextResponse.json({
      settings: data || { username: username.toLowerCase(), pvp_enabled: false },
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielereinstellungen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, pvp_enabled } = body

    if (!username) {
      return NextResponse.json({ error: "Benutzername erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Prüfe, ob die Tabelle existiert
    const { error: tableCheckError } = await supabase.from("player_settings").select("count(*)").limit(1)

    if (tableCheckError) {
      // Wenn die Tabelle nicht existiert, erstelle sie
      await supabase.rpc("create_player_settings_table")
    }

    // Spielereinstellungen aktualisieren oder erstellen
    const { data, error } = await supabase.from("player_settings").upsert(
      {
        username: username.toLowerCase(),
        pvp_enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "username" },
    )

    if (error) throw error

    return NextResponse.json({
      message: "Einstellungen erfolgreich gespeichert",
    })
  } catch (error) {
    console.error("Fehler beim Speichern der Spielereinstellungen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
