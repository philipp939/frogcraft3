import { getTopBounty, getTopBalance, getTopPlaytime } from "@/lib/db"

export async function GET() {
  try {
    const [bounty, balance, playtime] = await Promise.all([getTopBounty(5), getTopBalance(5), getTopPlaytime(5)])

    return Response.json({
      bounty,
      balance,
      playtime,
    })
  } catch (error) {
    console.error("Error fetching leaderboards:", error)
    return Response.json({ error: "Failed to fetch leaderboards" }, { status: 500 })
  }
}
