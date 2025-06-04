import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
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
