import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()
    const supabase = createServerSupabaseClient()

    // Spieler abrufen oder erstellen
    let { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("username", username)
      .single()

    if (playerError && playerError.code === "PGRST116") {
      // Spieler existiert nicht, erstellen
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert([
          {
            username,
            joined_at: new Date().toISOString(),
            last_seen: new Date().toISOString(),
            playtime_minutes: 0,
            pvp_enabled: true,
            verified: false,
            deaths: 0,
            kills: 0,
            bounty: 0,
          },
        ])
        .select()
        .single()

      if (createError) throw createError
      player = newPlayer
    } else if (playerError) {
      throw playerError
    }

    return NextResponse.json({
      player,
      settings: {
        pvp_enabled: player.pvp_enabled || false,
        verified: player.verified || false,
      },
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerdaten:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spielerdaten" }, { status: 500 })
  }
}
