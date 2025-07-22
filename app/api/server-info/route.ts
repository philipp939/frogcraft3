import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM server_info_cards ORDER BY position ASC, created_at ASC")
    return NextResponse.json({ cards: result.rows })
  } catch (error) {
    console.error("Fehler beim Laden der Server Info Karten:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Daten" }, { status: 500 })
  }
}
