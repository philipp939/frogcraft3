import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()
    const supabase = createServerSupabaseClient()

    // Spieler abrufen oder erstellen
    let { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("username", username)
      .single()

    if (playerError && playerError.code === "PGRST116") {
      // Spieler existiert nicht, erstellen
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
        throw createError
      }
      player = newPlayer
    } else if (playerError) {
      console.error("Fehler beim Abrufen des Spielers:", playerError)
      throw playerError
    }

    // Einstellungen abrufen
    const { data: settingsData, error: settingsError } = await supabase
      .from("player_settings")
      .select("setting_name, setting_value")
      .eq("player_id", player.id)

    if (settingsError) {
      console.error("Fehler beim Abrufen der Einstellungen:", settingsError)
      // Nicht kritisch, weiter machen
    }

    // Einstellungen in ein Objekt umwandeln
    const settings: Record<string, boolean> = {}
    settingsData?.forEach((setting) => {
      settings[setting.setting_name] = setting.setting_value
    })

    // Bans abrufen
    const { data: bansData, error: bansError } = await supabase
      .from("bans")
      .select("*")
      .eq("player_id", player.id)
      .order("banned_at", { ascending: false })

    if (bansError) {
      console.error("Fehler beim Abrufen der Bans:", bansError)
      // Nicht kritisch, weiter machen
    }

    return NextResponse.json({
      player,
      settings,
      bans: bansData || [],
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerdaten:", error)
    return NextResponse.json(
      {
        error: "Fehler beim Abrufen der Spielerdaten",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    )
  }
}
