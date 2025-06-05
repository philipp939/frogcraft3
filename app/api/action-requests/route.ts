import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "../../../lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Benutzername erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Spieler abrufen
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("uuid")
      .eq("username", username.toLowerCase())
      .single()

    if (playerError) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    // Aktionsanfragen abrufen
    const { data: actionRequests, error: actionError } = await supabase
      .from("action_requests")
      .select("*")
      .eq("uuid", player.uuid)
      .order("created_at", { ascending: false })

    if (actionError) throw actionError

    return NextResponse.json({
      actionRequests,
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Aktionsanfragen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
