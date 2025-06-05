import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Top Kills abrufen
    const { data: killsData, error: killsError } = await supabase
      .from("players")
      .select("username, kills")
      .order("kills", { ascending: false })
      .limit(10)

    if (killsError) {
      console.error("Fehler beim Abrufen der Kills:", killsError)
    }

    // Top Bounty abrufen
    const { data: bountyData, error: bountyError } = await supabase
      .from("players")
      .select("username, bounty")
      .order("bounty", { ascending: false })
      .limit(10)

    if (bountyError) {
      console.error("Fehler beim Abrufen der Bounty:", bountyError)
    }

    return NextResponse.json({
      kills: killsData || [],
      bounty: bountyData || [],
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Leaderboards:", error)
    return NextResponse.json(
      {
        kills: [],
        bounty: [],
      },
      { status: 200 },
    )
  }
}
