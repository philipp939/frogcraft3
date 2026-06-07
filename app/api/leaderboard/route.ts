import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT username, kills, bounty, balance FROM players");
    const players = result.rows || [];

    const topKills = players
      .slice()
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 5);

    const topBounty = players
      .slice()
      .sort((a, b) => b.bounty - a.bounty)
      .slice(0, 5);

    const topBalance = players
      .slice()
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5);

    return NextResponse.json({
      kills: topKills,
      bounty: topBounty,
      balance: topBalance,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Leaderboards:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Leaderboards" }, { status: 500 });
  }
}
