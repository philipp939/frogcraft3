import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET: Spieler-Einstellungen für den Minecraft-Server abrufen
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const apiKey = url.searchParams.get("key")

    // API-Key prüfen
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    // Alle Spieler mit ihren Einstellungen abrufen
    const playersResult = await query("SELECT username, pvp_enabled, verified FROM players")

    // Daten in ein für den Minecraft-Server geeignetes Format umwandeln
    const formattedPlayers = playersResult.rows.map((player) => ({
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

    // Spieler-Statistiken aktualisieren
    for (const stat of playerStats) {
      if (!stat.username) continue

      const updateFields = ["last_seen = NOW()"]
      const updateValues = []
      let paramIndex = 1

      if (stat.playtime !== undefined) {
        updateFields.push(`playtime_minutes = $${paramIndex}`)
        updateValues.push(stat.playtime)
        paramIndex++
      }

      if (stat.deaths !== undefined) {
        updateFields.push(`deaths = $${paramIndex}`)
        updateValues.push(stat.deaths)
        paramIndex++
      }

      if (stat.kills !== undefined) {
        updateFields.push(`kills = $${paramIndex}`)
        updateValues.push(stat.kills)
        paramIndex++
      }

      if (stat.bounty !== undefined) {
        updateFields.push(`bounty = $${paramIndex}`)
        updateValues.push(stat.bounty)
        paramIndex++
      }

      // Füge den Spielernamen als letzten Parameter hinzu
      updateValues.push(stat.username.toLowerCase())

      await query(`UPDATE players SET ${updateFields.join(", ")} WHERE username = $${paramIndex}`, updateValues)
    }

    return NextResponse.json({
      message: "Daten erfolgreich aktualisiert",
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Daten:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
