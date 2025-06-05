import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const banId = Number.parseInt(params.id)

    if (isNaN(banId)) {
      return NextResponse.json({ error: "Ungültige Ban-ID" }, { status: 400 })
    }

    await query("UPDATE bans SET is_active = false WHERE id = $1", [banId])

    return NextResponse.json({ message: "Ban erfolgreich entfernt" })
  } catch (error) {
    console.error("Fehler beim Entfernen des Bans:", error)
    return NextResponse.json({ error: "Fehler beim Entfernen des Bans" }, { status: 500 })
  }
}
