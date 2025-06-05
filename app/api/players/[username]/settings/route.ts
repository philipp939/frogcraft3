import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()
    const settings = await request.json()

    // Spieler abrufen
    const playerResult = await query("SELECT uuid FROM players WHERE username = $1", [username])

    if (playerResult.rows.length === 0) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    // Einstellungen aktualisieren
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    if (settings.pvp_enabled !== undefined) {
      updateFields.push(`pvp_enabled = $${paramIndex}`)
      updateValues.push(settings.pvp_enabled)
      paramIndex++
    }

    if (settings.verified !== undefined) {
      updateFields.push(`verified = $${paramIndex}`)
      updateValues.push(settings.verified)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "Keine Einstellungen zum Aktualisieren" }, { status: 400 })
    }

    // Füge den Spielernamen als letzten Parameter hinzu
    updateValues.push(username)

    await query(`UPDATE players SET ${updateFields.join(", ")} WHERE username = $${paramIndex}`, updateValues)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Einstellungen:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Einstellungen" }, { status: 500 })
  }
}
