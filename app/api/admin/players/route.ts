import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: players, error } = await supabase
      .from("players")
      .select("uuid, username, joined_at, last_seen, playtime_minutes, pvp_enabled, verified, deaths, kills, bounty")
      .order("joined_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ players: players || [] })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spieler:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spieler" }, { status: 500 })
  }
}
