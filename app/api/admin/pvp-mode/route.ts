import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET: Aktuellen PVP-Modus abrufen
export async function GET() {
  try {
    // Prüfe ob es eine server_settings Tabelle gibt, falls nicht erstelle sie
    await query(`
      CREATE TABLE IF NOT EXISTS server_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value VARCHAR(100) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Hole aktuellen PVP-Modus
    const result = await query("SELECT setting_value FROM server_settings WHERE setting_key = 'pvp_mode'")

    const pvpMode = result.rows.length > 0 ? result.rows[0].setting_value : "player_choice"

    return NextResponse.json({ pvpMode })
  } catch (error) {
    console.error("Fehler beim Abrufen des PVP-Modus:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen des PVP-Modus" }, { status: 500 })
  }
}

// POST: PVP-Modus setzen
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pvpMode, adminPassword } = body

    // Admin-Passwort prüfen
    if (adminPassword !== "kahba") {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    if (!["forced_on", "forced_off", "player_choice"].includes(pvpMode)) {
      return NextResponse.json({ error: "Ungültiger PVP-Modus" }, { status: 400 })
    }

    // PVP-Modus in server_settings speichern
    await query(
      `
      INSERT INTO server_settings (setting_key, setting_value, updated_at)
      VALUES ('pvp_mode', $1, NOW())
      ON CONFLICT (setting_key) 
      DO UPDATE SET setting_value = $1, updated_at = NOW()
    `,
      [pvpMode],
    )

    // Bei forced_on oder forced_off alle Spieler updaten UND verified auf true setzen
    // Bei player_choice passiert nichts mit der Datenbank
    if (pvpMode === "forced_on") {
      await query("UPDATE players SET pvp_enabled = true, verified = true")
    } else if (pvpMode === "forced_off") {
      await query("UPDATE players SET pvp_enabled = false, verified = true")
    }

    return NextResponse.json({
      message: "PVP-Modus erfolgreich aktualisiert",
      pvpMode,
    })
  } catch (error) {
    console.error("Fehler beim Setzen des PVP-Modus:", error)
    return NextResponse.json({ error: "Fehler beim Setzen des PVP-Modus" }, { status: 500 })
  }
}
