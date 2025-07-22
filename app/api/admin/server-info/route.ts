import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { action, card, adminPassword } = await request.json()

    // Admin-Passwort prüfen
    if (adminPassword !== "kahba") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    switch (action) {
      case "create":
        await query("INSERT INTO server_info_cards (title, content, type, url, position) VALUES ($1, $2, $3, $4, $5)", [
          card.title,
          card.content,
          card.type,
          card.url || null,
          card.position || 0,
        ])
        break

      case "update":
        await query(
          "UPDATE server_info_cards SET title = $1, content = $2, type = $3, url = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5",
          [card.title, card.content, card.type, card.url || null, card.id],
        )
        break

      case "delete":
        await query("DELETE FROM server_info_cards WHERE id = $1", [card.id])
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler bei Server Info Operation:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
