import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const bansResult = await query(
      `SELECT b.*, p.username as player_username 
       FROM bans b 
       LEFT JOIN players p ON b.player_id = p.id 
       ORDER BY b.banned_at DESC`,
    )

    const bans = bansResult.rows.map((ban) => ({
      ...ban,
      player: { username: ban.player_username },
    }))

    return NextResponse.json({ bans })
  } catch (error) {
    console.error("Fehler beim Abrufen der Bans:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Bans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, reason, banType, duration, bannedBy } = body

    if (!username || !reason) {
      return NextResponse.json({ error: "Benutzername und Grund sind erforderlich" }, { status: 400 })
    }

    // Spieler finden oder erstellen
    const playerResult = await query("SELECT id FROM players WHERE username = $1", [username.toLowerCase()])

    let playerId
    if (playerResult.rows.length === 0) {
      // Spieler erstellen
      const newPlayerResult = await query("INSERT INTO players (username) VALUES ($1) RETURNING id", [
        username.toLowerCase(),
      ])
      playerId = newPlayerResult.rows[0].id
    } else {
      playerId = playerResult.rows[0].id
    }

    // Ban erstellen
    let expiresAt = null
    if (banType === "temporary" && duration) {
      const durationDays = Number.parseInt(duration)
      expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
    }

    await query(
      `INSERT INTO bans (player_id, reason, banned_by, ban_type, expires_at) 
       VALUES ($1, $2, $3, $4, $5)`,
      [playerId, reason, bannedBy || "Admin", banType, expiresAt],
    )

    return NextResponse.json({ message: "Ban erfolgreich erstellt" })
  } catch (error) {
    console.error("Fehler beim Erstellen des Bans:", error)
    return NextResponse.json({ error: "Fehler beim Erstellen des Bans" }, { status: 500 })
  }
}
