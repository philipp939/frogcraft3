import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// POST: Spieler PVP-Einstellung ändern
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, pvpEnabled } = body

    console.log("=== PVP Toggle API Start ===")
    console.log("Request body:", { username, pvpEnabled })

    if (!username) {
      console.log("Error: No username provided")
      return NextResponse.json({ error: "Benutzername ist erforderlich" }, { status: 400 })
    }

    // Prüfe aktuellen PVP-Modus
    console.log("Checking PVP mode...")
    const modeResult = await query("SELECT setting_value FROM server_settings WHERE setting_key = 'pvp_mode'")
    const pvpMode = modeResult.rows.length > 0 ? modeResult.rows[0].setting_value : "player_choice"
    console.log("PVP Mode:", pvpMode)

    // Wenn PVP erzwungen wird, erlaube keine Änderungen
    if (pvpMode !== "player_choice") {
      console.log("PVP is forced, blocking change")
      return NextResponse.json(
        {
          error: "PVP-Einstellungen können nicht geändert werden, da sie vom Server erzwungen werden",
        },
        { status: 403 },
      )
    }

    // Einfache Spieler PVP-Einstellung aktualisieren (ohne komplexe Checks)
    console.log("Updating player PVP setting...")
    console.log("SQL Query:", "UPDATE players SET pvp_enabled = $1 WHERE username = $2", [pvpEnabled, username])

    const updateResult = await query("UPDATE players SET pvp_enabled = $1 WHERE username = $2", [pvpEnabled, username])

    console.log("Update result rowCount:", updateResult.rowCount)

    // Prüfe ob Update erfolgreich war
    if (updateResult.rowCount === 0) {
      console.log("No rows updated - player might not exist")
      return NextResponse.json(
        { error: "Spieler nicht gefunden oder konnte nicht aktualisiert werden" },
        { status: 404 },
      )
    }

    console.log("PVP setting updated successfully")
    console.log("=== PVP Toggle API End ===")

    return NextResponse.json({
      success: true,
      message: `PVP ${pvpEnabled ? "aktiviert" : "deaktiviert"}`,
      pvpEnabled,
    })
  } catch (error) {
    console.error("=== PVP Toggle API ERROR ===")
    console.error("Error details:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    console.error("=== END ERROR ===")

    return NextResponse.json(
      {
        error: "Fehler beim Aktualisieren der PVP-Einstellung",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
