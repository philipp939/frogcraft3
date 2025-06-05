import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: players, error } = await supabase.from("players").select("*").order("username")

    if (error) throw error

    return NextResponse.json({ players })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spieler:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spieler" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { username, kills, bounty } = await request.json()
    const supabase = createServerSupabaseClient()

    // Spieler aktualisieren
    const { data: player, error } = await supabase
      .from("players")
      .upsert([
        {
          username: username.toLowerCase(),
          kills: kills || 0,
          bounty: bounty || 0,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ player })
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Spielers:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Spielers" }, { status: 500 })
  }
}
