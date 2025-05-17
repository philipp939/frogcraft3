import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// GET: Spieler-Einstellungen für den Minecraft-Server abrufen
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const apiKey = url.searchParams.get("key")

    // API-Key prüfen
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Alle Spieler mit ihren Einstellungen abrufen
    const { data: players, error: playersError } = await supabase.from("players").select(`
        id,
        username,
        player_settings(setting_name, setting_value)
      `)

    if (playersError) throw playersError

    // Daten in ein für den Minecraft-Server geeignetes Format umwandeln
    const formattedPlayers = players.map((player) => {
      const settings: Record<string, boolean> = {}

      player.player_settings.forEach((setting: any) => {
        settings[setting.setting_name] = setting.setting_value
      })

      return {
        username: player.username,
        settings,
      }
    })

    return NextResponse.json({
      players: formattedPlayers,
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spieler-Einstellungen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

// POST: Spieler-Statistiken vom Minecraft-Server aktualisieren
export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const apiKey = url.searchParams.get("key")

    // API-Key prüfen
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const body = await request.json()
    const { playerStats, logs } = body

    if (!playerStats && !logs) {
      return NextResponse.json({ error: "Keine Daten zum Aktualisieren" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Spieler-Statistiken aktualisieren
    if (playerStats && Array.isArray(playerStats)) {
      for (const stat of playerStats) {
        if (!stat.username) continue

        // Spieler abrufen
        const { data: player } = await supabase
          .from("players")
          .select("id")
          .eq("username", stat.username.toLowerCase())
          .single()

        if (!player) continue

        // Statistiken aktualisieren
        await supabase.from("player_stats").upsert(
          {
            player_id: player.id,
            playtime_minutes: stat.playtime || 0,
            deaths: stat.deaths || 0,
            kills: stat.kills || 0,
            blocks_broken: stat.blocks_broken || 0,
            blocks_placed: stat.blocks_placed || 0,
            last_updated: new Date().toISOString(),
          },
          { onConflict: "player_id" },
        )
      }
    }

    // Server-Logs hinzufügen
    if (logs && Array.isArray(logs)) {
      for (const log of logs) {
        if (!log.type || !log.message) continue

        let playerId = null

        if (log.username) {
          // Spieler abrufen
          const { data: player } = await supabase
            .from("players")
            .select("id")
            .eq("username", log.username.toLowerCase())
            .single()

          if (player) {
            playerId = player.id
          }
        }

        // Log hinzufügen
        await supabase.from("server_logs").insert([
          {
            log_type: log.type,
            message: log.message,
            player_id: playerId,
          },
        ])
      }
    }

    return NextResponse.json({
      message: "Daten erfolgreich aktualisiert",
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Daten:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
