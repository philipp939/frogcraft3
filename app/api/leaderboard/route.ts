import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // Top Kills abrufen (höchste zuerst)
    const { data: killsData, error: killsError } = await supabase
      .from("players")
      .select("username, kills")
      .not("kills", "is", null)
      .order("kills", { ascending: false })
      .limit(10)

    if (killsError) {
      console.error("Fehler beim Abrufen der Kills:", killsError)
      throw killsError
    }

    // Top Bounty abrufen (höchste zuerst)
    const { data: bountyData, error: bountyError } = await supabase
      .from("players")
      .select("username, bounty")
      .not("bounty", "is", null)
      .order("bounty", { ascending: false })
      .limit(10)

    if (bountyError) {
      console.error("Fehler beim Abrufen der Bounty:", bountyError)
      throw bountyError
    }

    return NextResponse.json({
      kills: killsData || [],
      bounty: bountyData || [],
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Leaderboards:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Leaderboards" }, { status: 500 })
  }
}
