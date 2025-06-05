import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username } = body

    // Validiere die Eingaben
    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich" }, { status: 400 })
    }

    // Einfache Bestätigung - in der Realität würdest du das in einer Datenbank speichern
    console.log(`PVP aktiviert für Spieler: ${username}`)

    return NextResponse.json({
      message: "PVP wurde erfolgreich für deinen Account aktiviert!",
    })
  } catch (error) {
    console.error("Fehler bei der PVP-Aktivierung:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
