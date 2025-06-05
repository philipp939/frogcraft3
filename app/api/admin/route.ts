import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "../../../lib/supabase"

async function isModeratorOrAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["moderator", "admin"])

  if (error) {
    console.error("Fehler Rollenprüfung:", JSON.stringify(error, null, 2))
    return false
  }

  return data && data.length > 0
}

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })

    if (!(await isModeratorOrAdmin(supabase, session.user.id))) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("*")
      .order("username")

    if (playersError) throw playersError

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

    return NextResponse.json({ players, pendingSettings, logs })
  } catch (error) {
    console.error("Fehler beim Abrufen der Admin-Daten:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })

    if (!(await isModeratorOrAdmin(supabase, session.user.id))) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    switch (action) {
      case "approve_setting":
        if (!data.settingId) return NextResponse.json({ error: "Einstellungs-ID erforderlich" }, { status: 400 })
        await supabase.from("player_settings").update({
          requires_mod_approval: false,
          updated_at: new Date().toISOString(),
        }).eq("id", data.settingId)
        return NextResponse.json({ message: "Einstellung genehmigt" })

      case "reject_setting":
        if (!data.settingId) return NextResponse.json({ error: "Einstellungs-ID erforderlich" }, { status: 400 })
        await supabase.from("player_settings").delete().eq("id", data.settingId)
        return NextResponse.json({ message: "Einstellung abgelehnt" })

      case "add_log":
        if (!data.logType || !data.message)
          return NextResponse.json({ error: "Log-Typ und Nachricht erforderlich" }, { status: 400 })

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
    console.error("Fehler bei der Admin-Aktion:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
