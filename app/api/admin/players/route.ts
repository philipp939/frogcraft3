import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const playersResult = await query(
      `SELECT id, username, joined_at, last_seen, playtime_minutes, 
      pvp_enabled, verified, deaths, kills, bounty 
      FROM players ORDER BY joined_at DESC`,
    )

    return NextResponse.json({ players: playersResult.rows || [] })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spieler:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spieler" }, { status: 500 })
  }
}
