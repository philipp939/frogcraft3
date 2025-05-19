import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    const supabase = createServerSupabaseClient()

    if (username) {
      // Fetch stats for a specific player
      const { data, error } = await supabase
        .from("player_stats")
        .select("*")
        .eq("username", username.toLowerCase())
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      return NextResponse.json({ stats: data || null })
    } else {
      // Fetch leaderboard
      const { data, error } = await supabase
        .from("player_stats")
        .select("*")
        .order("playtime_minutes", { ascending: false })
        .limit(10)

      if (error) {
        throw error
      }

      return NextResponse.json({ players: data || [] })
    }
  } catch (error) {
    console.error("Error fetching player stats:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, stats } = body

    if (!username || !stats) {
      return NextResponse.json({ error: "Benutzername und Statistiken sind erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Update or insert player stats
    const { error } = await supabase.from("player_stats").upsert({
      username: username.toLowerCase(),
      playtime_minutes: stats.playtime_minutes || 0,
      deaths: stats.deaths || 0,
      kills: stats.kills || 0,
      last_online: new Date().toISOString(),
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Statistiken erfolgreich aktualisiert" })
  } catch (error) {
    console.error("Error updating player stats:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
