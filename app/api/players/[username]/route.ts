import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()

    // Spieler abrufen
    const playerResult = await query("SELECT * FROM players WHERE username = $1", [username])

    if (playerResult.rows.length === 0) {
      // Spieler existiert nicht, erstellen
      const newPlayerResult = await query(
        `INSERT INTO players 
        (username, joined_at, last_seen, playtime_minutes, pvp_enabled, verified, deaths, kills, bounty) 
        VALUES ($1, NOW(), NOW(), 0, true, false, 0, 0, 0) 
        RETURNING *`,
        [username],
      )

      return NextResponse.json({
        player: newPlayerResult.rows[0],
        settings: {
          pvp_enabled: newPlayerResult.rows[0].pvp_enabled || false,
          verified: newPlayerResult.rows[0].verified || false,
        },
      })
    }

    return NextResponse.json({
      player: playerResult.rows[0],
      settings: {
        pvp_enabled: playerResult.rows[0].pvp_enabled || false,
        verified: playerResult.rows[0].verified || false,
      },
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerdaten:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spielerdaten" }, { status: 500 })
  }
}
