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
        // Prüfen ob bereits 4 Karten existieren
        const countResult = await query("SELECT COUNT(*) as count FROM server_info_cards")
        const currentCount = Number.parseInt(countResult.rows[0].count)

        if (currentCount >= 4) {
          return NextResponse.json({ error: "Maximum von 4 Karten erreicht" }, { status: 400 })
        }

        await query("INSERT INTO server_info_cards (title, content, type, position) VALUES ($1, $2, $3, $4)", [
          card.title,
          card.content,
          "text", // Immer text, da wir Links über Markdown machen
          card.position || currentCount + 1,
        ])
        break

      case "update":
        await query(
          "UPDATE server_info_cards SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
          [card.title, card.content, card.id],
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
