// Datei: app/api/player/[username]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Supabase-Client mit env-Variablen
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(
  request: NextRequest,
  context: { params: { username: string } },
) {
  try {
    const { username } = context.params

    if (!username) {
      return NextResponse.json({ error: "Username ist erforderlich" }, { status: 400 })
    }

    const cleanUsername = username.toLowerCase().trim()

    if (!cleanUsername) {
      return NextResponse.json({ error: "Ungültiger Username" }, { status: 400 })
    }

    // Spieler abrufen
    let { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("username", cleanUsername)
      .single()

    if (playerError && playerError.code === "PGRST116") {
      // Spieler existiert nicht, neu erstellen
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert([
          {
            username: cleanUsername,
            uuid: `offline-${cleanUsername}-${Date.now()}`,
            created_at: new Date().toISOString(),
            kills: 0,
            bounty: 0,
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error("Fehler beim Erstellen:", createError)
        return NextResponse.json({ error: "Fehler beim Erstellen des Spielers" }, { status: 500 })
      }

      player = newPlayer
    } else if (playerError) {
      console.error("Abruf-Fehler:", playerError)
      return NextResponse.json({ error: "Fehler beim Abrufen" }, { status: 500 })
    }

    // Einstellungen abrufen
    const { data: settingsData } = await supabase
      .from("player_settings")
      .select("setting_name, setting_value")
      .eq("player_id", player.id)

    const settings: Record<string, boolean> = {}
    settingsData?.forEach((s) => {
      settings[s.setting_name] = s.setting_value
    })

    // Bans abrufen
    const { data: bansData } = await supabase
      .from("bans")
      .select("*")
      .eq("player_id", player.id)
      .order("banned_at", { ascending: false })

    return NextResponse.json({
      player,
      settings,
      bans: bansData || [],
    })
  } catch (error) {
    console.error("Fehler:", error)
    return NextResponse.json(
      {
        error: "Unerwarteter Fehler",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

