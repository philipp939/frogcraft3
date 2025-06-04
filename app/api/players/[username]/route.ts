import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    console.log("API aufgerufen für Spieler:", params.username)

    const supabase = createServerSupabaseClient()

    // Spieler in der Datenbank suchen
    const { data: player, error } = await supabase
      .from("players")
      .select("*")
      .eq("username", params.username.toLowerCase())
      .single()

    console.log("Supabase Antwort:", { player, error })

    if (error) {
      console.error("Supabase Fehler:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
      }
      throw error
    }

    if (!player) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json({
      player: {
        username: player.username,
        uuid: player.uuid,
        kills: player.kills || 0,
        bounty: player.bounty || 0,
        last_seen: player.last_seen,
        created_at: player.created_at,
      },
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerdaten:", error)
    return NextResponse.json(
      {
        error: "Ein Fehler ist aufgetreten beim Laden der Spielerdaten",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    )
  }
}
