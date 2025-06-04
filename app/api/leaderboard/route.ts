import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "5")
    const offset = (page - 1) * limit

    // Top Kills abrufen (auch 0-Werte, höchste zuerst)
    const { data: killsData, error: killsError } = await supabase
      .from("players")
      .select("username, kills")
      .order("kills", { ascending: false })
      .range(offset, offset + limit - 1)

    if (killsError) {
      console.error("Fehler beim Abrufen der Kills:", killsError)
      throw killsError
    }

    // Top Bounty abrufen (auch 0-Werte, höchste zuerst)
    const { data: bountyData, error: bountyError } = await supabase
      .from("players")
      .select("username, bounty")
      .order("bounty", { ascending: false })
      .range(offset, offset + limit - 1)

    if (bountyError) {
      console.error("Fehler beim Abrufen der Bounty:", bountyError)
      throw bountyError
    }

    // Gesamtanzahl für Pagination
    const { count: killsCount } = await supabase.from("players").select("*", { count: "exact", head: true })

    const { count: bountyCount } = await supabase.from("players").select("*", { count: "exact", head: true })

    return NextResponse.json({
      kills: killsData || [],
      bounty: bountyData || [],
      pagination: {
        page,
        limit,
        totalKills: killsCount || 0,
        totalBounty: bountyCount || 0,
        hasNextPage: offset + limit < (killsCount || 0),
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Leaderboards:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Leaderboards" }, { status: 500 })
  }
}
