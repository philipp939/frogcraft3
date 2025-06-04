import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@supabase/supabase-js"

// Hilfsfunktion zur Überprüfung der Moderator-Berechtigung
async function isModeratorOrAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["moderator", "admin"])

  return data && data.length > 0
}

// GET: Admin-Daten abrufen
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Alle Spieler abrufen
    const { data: players, error: playersError } = await supabase.from("players").select("*").order("username")

    if (playersError) throw playersError

    // Ausstehende Einstellungsänderungen abrufen (die Moderator-Genehmigung erfordern)
    const { data: pendingSettings, error: pendingError } = await supabase
      .from("player_settings")
      .select(`
        id,
        setting_name,
        setting_value,
        updated_at,
        players(username)
      `)
      .eq("requires_mod_approval", true)

    if (pendingError) throw pendingError

    // Server-Logs abrufen
    const { data: logs, error: logsError } = await supabase
      .from("server_logs")
      .select(`
        id,
        log_type,
        message,
        created_at,
        players(username)
      `)
      .order("created_at", { ascending: false })
      .limit(100)

    if (logsError) throw logsError

    return NextResponse.json({
      players,
      pendingSettings,
      logs,
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Admin-Daten:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

// POST: Admin-Aktionen ausführen
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, password, data } = body

    // Passwort prüfen
    if (password !== "kahba") {
      return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Verschiedene Admin-Aktionen
    switch (action) {
      case "approve_setting":
        // Einstellung genehmigen
        if (!data.settingId) {
          return NextResponse.json({ error: "Einstellungs-ID erforderlich" }, { status: 400 })
        }

        await supabase
          .from("player_settings")
          .update({
            requires_mod_approval: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.settingId)

        return NextResponse.json({ message: "Einstellung genehmigt" })

      case "reject_setting":
        // Einstellung ablehnen
        if (!data.settingId) {
          return NextResponse.json({ error: "Einstellungs-ID erforderlich" }, { status: 400 })
        }

        await supabase.from("player_settings").delete().eq("id", data.settingId)

        return NextResponse.json({ message: "Einstellung abgelehnt" })

      case "add_log":
        // Log hinzufügen
        if (!data.logType || !data.message) {
          return NextResponse.json({ error: "Log-Typ und Nachricht erforderlich" }, { status: 400 })
        }

        await supabase.from("server_logs").insert([
          {
            log_type: data.logType,
            message: data.message,
            player_id: data.playerId || null,
          },
        ])

        return NextResponse.json({ message: "Log hinzugefügt" })

      default:
        return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 })
    }
  } catch (error) {
    console.error("Fehler bei der Admin-Aktion:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
