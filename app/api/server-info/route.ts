import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM server_info_cards ORDER BY position ASC, id ASC LIMIT 4")

    return NextResponse.json({
      cards: result.rows || [],
    })
  } catch (error) {
    console.error("Fehler beim Laden der Server Info:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
