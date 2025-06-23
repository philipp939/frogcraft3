import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// POST: Spieler PVP-Einstellung ändern
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, pvpEnabled } = body

    if (!username) {
      return NextResponse.json({ error: "Benutzername ist erforderlich" }, { status: 400 })
    }

    // Prüfe aktuellen PVP-Modus
    const modeResult = await query("SELECT setting_value FROM server_settings WHERE setting_key = 'pvp_mode'")
    const pvpMode = modeResult.rows.length > 0 ? modeResult.rows[0].setting_value : "player_choice"

    // Wenn PVP erzwungen wird, erlaube keine Änderungen
    if (pvpMode !== "player_choice") {
      return NextResponse.json(
        {
          error: "PVP-Einstellungen können nicht geändert werden, da sie vom Server erzwungen werden",
        },
        { status: 403 },
      )
    }

    // Spieler PVP-Einstellung aktualisieren UND verified auf false setzen
    const updateResult = await query("UPDATE players SET pvp_enabled = $1, verified = false WHERE username = $2", [
      pvpEnabled,
      username,
    ])

    // Prüfe ob Update erfolgreich war
    if (updateResult.rowCount === 0) {
      return NextResponse.json(
        { error: "Spieler nicht gefunden oder konnte nicht aktualisiert werden" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `PVP ${pvpEnabled ? "aktiviert" : "deaktiviert"}. Führe /verify auf dem Server aus, um deine Änderungen zu bestätigen.`,
      pvpEnabled,
      requiresVerification: true,
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der PVP-Einstellung:", error)
    return NextResponse.json(
      {
        error: "Fehler beim Aktualisieren der PVP-Einstellung",
      },
      { status: 500 },
    )
  }
}
