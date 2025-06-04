import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Top 5 Kills abrufen
    const { data: killsLeaderboard, error: killsError } = await supabase
      .from("players")
      .select("username, kills")
      .order("kills", { ascending: false })
      .limit(5)

    if (killsError) throw killsError

    // Top 5 Bounty abrufen
    const { data: bountyLeaderboard, error: bountyError } = await supabase
      .from("players")
      .select("username, bounty")
      .order("bounty", { ascending: false })
      .limit(5)

    if (bountyError) throw bountyError

    return NextResponse.json({
      kills: killsLeaderboard || [],
      bounty: bountyLeaderboard || [],
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Leaderboards:", error)
    return NextResponse.json(
      {
        error: "Fehler beim Laden der Leaderboards",
        kills: [],
        bounty: [],
      },
      { status: 500 },
    )
  }
}
