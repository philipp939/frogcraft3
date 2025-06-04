import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    console.log("API aufgerufen für Username:", params.username)

    if (!params || !params.username) {
      console.log("Kein Username bereitgestellt")
      return NextResponse.json({ error: "Username ist erforderlich" }, { status: 400 })
    }

    const username = params.username.toLowerCase().trim()
    console.log("Verarbeiteter Username:", username)

    if (!username) {
      return NextResponse.json({ error: "Ungültiger Username" }, { status: 400 })
    }

    // Spieler abrufen oder erstellen
    let { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("username", username)
      .single()

    console.log("Spieler-Abfrage Ergebnis:", { player, playerError })

    if (playerError && playerError.code === "PGRST116") {
      // Spieler existiert nicht, erstellen
      console.log("Erstelle neuen Spieler:", username)
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert([
          {
            username,
            uuid: `offline-${username}-${Date.now()}`,
            created_at: new Date().toISOString(),
            kills: 0,
            bounty: 0,
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error("Fehler beim Erstellen des Spielers:", createError)
        return NextResponse.json({ error: "Fehler beim Erstellen des Spielers" }, { status: 500 })
      }
      player = newPlayer
      console.log("Neuer Spieler erstellt:", player)
    } else if (playerError) {
      console.error("Fehler beim Abrufen des Spielers:", playerError)
      return NextResponse.json({ error: "Fehler beim Abrufen des Spielers" }, { status: 500 })
    }

    // Einstellungen abrufen
    const { data: settingsData, error: settingsError } = await supabase
      .from("player_settings")
      .select("setting_name, setting_value")
      .eq("player_id", player.id)

    console.log("Einstellungen-Abfrage:", { settingsData, settingsError })

    // Einstellungen in ein Objekt umwandeln
    const settings: Record<string, boolean> = {}
    if (settingsData) {
      settingsData.forEach((setting) => {
        settings[setting.setting_name] = setting.setting_value
      })
    }

    // Bans abrufen
    const { data: bansData, error: bansError } = await supabase
      .from("bans")
      .select("*")
      .eq("player_id", player.id)
      .order("banned_at", { ascending: false })

    console.log("Bans-Abfrage:", { bansData, bansError })

    const result = {
      player,
      settings,
      bans: bansData || [],
    }

    console.log("API Antwort:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Unerwarteter Fehler in API:", error)
    return NextResponse.json(
      {
        error: "Unerwarteter Fehler beim Abrufen der Spielerdaten",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    )
  }
}
