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

    // Spieler PVP-Einstellung aktualisieren
    await query("UPDATE players SET pvp_enabled = $1 WHERE username = $2", [pvpEnabled, username.toLowerCase()])

    return NextResponse.json({
      message: `PVP ${pvpEnabled ? "aktiviert" : "deaktiviert"}`,
      pvpEnabled,
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der PVP-Einstellung:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren der PVP-Einstellung" }, { status: 500 })
  }
}
