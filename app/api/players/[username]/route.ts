import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()

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
            uuid: `offline-${username}-${Date.now()}`, // Temporäre UUID für Offline-Spieler
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) throw createError
      player = newPlayer
    } else if (playerError) {
      throw playerError
    }

    // Einstellungen abrufen
    const { data: settingsData, error: settingsError } = await supabase
      .from("player_settings")
      .select("setting_name, setting_value")
      .eq("player_id", player.id)

    if (settingsError) throw settingsError

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

    if (bansError) throw bansError

    return NextResponse.json({
      player,
      settings,
      bans: bansData || [],
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerdaten:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spielerdaten" }, { status: 500 })
  }
}
