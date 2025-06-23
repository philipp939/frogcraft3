import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// POST: Spieler PVP-Einstellung ändern
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, pvpEnabled } = body

    console.log("PVP Toggle Request:", { username, pvpEnabled }) // Debug Log

    if (!username) {
      return NextResponse.json({ error: "Benutzername ist erforderlich" }, { status: 400 })
    }

    // Prüfe aktuellen PVP-Modus
    const modeResult = await query("SELECT setting_value FROM server_settings WHERE setting_key = 'pvp_mode'")
    const pvpMode = modeResult.rows.length > 0 ? modeResult.rows[0].setting_value : "player_choice"

    console.log("Current PVP Mode:", pvpMode) // Debug Log

    // Wenn PVP erzwungen wird, erlaube keine Änderungen
    if (pvpMode !== "player_choice") {
      return NextResponse.json(
        {
          error: "PVP-Einstellungen können nicht geändert werden, da sie vom Server erzwungen werden",
        },
        { status: 403 },
      )
    }

    // Prüfe ob Spieler existiert
    const playerCheck = await query("SELECT id, username FROM players WHERE LOWER(username) = LOWER($1)", [username])

    if (playerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    console.log("Player found:", playerCheck.rows[0]) // Debug Log

    // Spieler PVP-Einstellung aktualisieren
    const updateResult = await query(
      "UPDATE players SET pvp_enabled = $1 WHERE LOWER(username) = LOWER($2) RETURNING username, pvp_enabled",
      [pvpEnabled, username],
    )

    console.log("Update result:", updateResult.rows) // Debug Log

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: "Spieler konnte nicht aktualisiert werden" }, { status: 500 })
    }

    return NextResponse.json({
      message: `PVP ${pvpEnabled ? "aktiviert" : "deaktiviert"}`,
      pvpEnabled,
      player: updateResult.rows[0],
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der PVP-Einstellung:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren der PVP-Einstellung" }, { status: 500 })
  }
}
