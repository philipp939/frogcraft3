import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: bans, error } = await supabase
      .from("bans")
      .select(`
        *,
        player:players(username)
      `)
      .order("banned_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ bans })
  } catch (error) {
    console.error("Fehler beim Abrufen der Bans:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Bans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { username, reason, banType, duration, bannedBy } = await request.json()
    const supabase = createServerSupabaseClient()

    // Spieler finden
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id")
      .eq("username", username.toLowerCase())
      .single()

    if (playerError) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    // Expires-Datum berechnen
    let expiresAt = null
    if (banType === "temporary") {
      const now = new Date()
      now.setDate(now.getDate() + Number.parseInt(duration))
      expiresAt = now.toISOString()
    }

    // Ban erstellen
    const { data: ban, error: banError } = await supabase
      .from("bans")
      .insert([
        {
          player_id: player.id,
          reason,
          banned_by: bannedBy,
          ban_type: banType,
          expires_at: expiresAt,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (banError) throw banError

    return NextResponse.json({ ban })
  } catch (error) {
    console.error("Fehler beim Erstellen des Bans:", error)
    return NextResponse.json({ error: "Fehler beim Erstellen des Bans" }, { status: 500 })
  }
}
