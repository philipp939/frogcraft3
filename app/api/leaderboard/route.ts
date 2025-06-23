import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Top Kills abrufen (sortiert nach kills DESC)
    const killsResult = await query("SELECT username, kills FROM players ORDER BY kills DESC LIMIT 10")

    // Top Bounty abrufen (sortiert nach bounty DESC - höchste bounty zuerst)
    const bountyResult = await query("SELECT username, bounty FROM players ORDER BY bounty DESC LIMIT 10")

    // Top Balance abrufen (sortiert nach balance DESC - höchste balance zuerst)
    const balanceResult = await query("SELECT username, balance FROM players ORDER BY balance DESC LIMIT 10")

    return NextResponse.json({
      kills: killsResult.rows || [],
      bounty: bountyResult.rows || [],
      balance: balanceResult.rows || [],
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Leaderboards:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Leaderboards" }, { status: 500 })
  }
}
