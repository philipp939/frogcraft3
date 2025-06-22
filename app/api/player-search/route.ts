import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Benutzername ist erforderlich" }, { status: 400 })
    }

    // Spieler aus Datenbank abrufen (genau wie beim Leaderboard)
    const playerResult = await query("SELECT * FROM players WHERE username = $1", [username.toLowerCase()])

    if (playerResult.rows.length === 0) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    const player = playerResult.rows[0]

    return NextResponse.json({
      player: {
        id: player.id,
        username: player.username,
        joined_at: player.joined_at,
        last_seen: player.last_seen,
        playtime_minutes: player.playtime_minutes || 0,
        pvp_enabled: player.pvp_enabled || false,
        verified: player.verified || false,
        deaths: player.deaths || 0,
        kills: player.kills || 0,
        bounty: player.bounty || 0,
      },
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerdaten:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spielerdaten" }, { status: 500 })
  }
}
