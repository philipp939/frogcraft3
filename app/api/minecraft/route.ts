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
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("username, pvp_enabled, verified")

    if (playersError) throw playersError

    // Daten in ein für den Minecraft-Server geeignetes Format umwandeln
    const formattedPlayers = players.map((player) => ({
      username: player.username,
      settings: {
        pvp_enabled: player.pvp_enabled || false,
        verified: player.verified || false,
      },
    }))

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
    const { playerStats } = body

    if (!playerStats || !Array.isArray(playerStats)) {
      return NextResponse.json({ error: "Keine Spielerstatistiken zum Aktualisieren" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Spieler-Statistiken aktualisieren
    for (const stat of playerStats) {
      if (!stat.username) continue

      const updateData: any = {
        last_seen: new Date().toISOString(),
      }

      if (stat.playtime !== undefined) updateData.playtime_minutes = stat.playtime
      if (stat.deaths !== undefined) updateData.deaths = stat.deaths
      if (stat.kills !== undefined) updateData.kills = stat.kills
      if (stat.bounty !== undefined) updateData.bounty = stat.bounty

      await supabase.from("players").update(updateData).eq("username", stat.username.toLowerCase())
    }

    return NextResponse.json({
      message: "Daten erfolgreich aktualisiert",
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Daten:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
