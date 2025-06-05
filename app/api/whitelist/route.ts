import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username } = body

    // Validiere die Eingaben
    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich" }, { status: 400 })
    }

    // Überprüfe, ob der Spieler bereits existiert
    const existingPlayerResult = await query("SELECT username FROM players WHERE username = $1", [
      username.toLowerCase(),
    ])

    if (existingPlayerResult.rows.length > 0) {
      return NextResponse.json({ error: "Spieler ist bereits registriert" }, { status: 400 })
    }

    // Spieler zur Datenbank hinzufügen
    await query(
      `INSERT INTO players 
      (username, joined_at, last_seen, playtime_minutes, pvp_enabled, verified, deaths, kills, bounty) 
      VALUES ($1, NOW(), NOW(), 0, false, false, 0, 0, 0)`,
      [username.toLowerCase()],
    )

    return NextResponse.json({
      message: "Du wurdest erfolgreich zur Whitelist hinzugefügt!",
    })
  } catch (error) {
    console.error("Fehler bei der Whitelist-Anfrage:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
