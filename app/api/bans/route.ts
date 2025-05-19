import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, reason, duration_minutes, banned_by } = body

    if (!username || !reason || duration_minutes === undefined || !banned_by) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Spieler-UUID abrufen (optional)
    let playerUuid = null
    try {
      const { data: playerData } = await supabase.from("players").select("uuid").ilike("username", username).limit(1)

      if (playerData && playerData.length > 0) {
        playerUuid = playerData[0].uuid
      }
    } catch (playerError) {
      console.warn("Spieler nicht gefunden, fahre ohne UUID fort:", playerError)
      // Wir setzen die Ausführung fort, auch wenn der Spieler nicht gefunden wurde
    }

    // Bann erstellen - mit verbesserter Fehlerbehandlung
    try {
      const { error } = await supabase.from("bans").insert([
        {
          uuid: playerUuid, // Kann null sein, wenn der Spieler nicht gefunden wurde
          username: username.toLowerCase(),
          reason,
          banned_by,
          timestamp: new Date().toISOString(),
          duration_minutes,
          source: "web",
          active: true,
        },
      ])

      if (error) {
        console.error("Detaillierter Fehler beim Erstellen des Banns:", error)
        return NextResponse.json(
          { error: "Fehler beim Erstellen des Banns: " + error.message, details: error },
          { status: 500 },
        )
      }

      return NextResponse.json({ message: "Bann erfolgreich erstellt" })
    } catch (insertError) {
      console.error("Exception beim Erstellen des Banns:", insertError)
      return NextResponse.json(
        {
          error:
            "Exception beim Erstellen des Banns: " +
            (insertError instanceof Error ? insertError.message : String(insertError)),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Allgemeiner Fehler:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("bans").select("*").order("timestamp", { ascending: false })

    if (error) {
      console.error("Fehler beim Abrufen der Banns:", error)
      return NextResponse.json({ error: "Fehler beim Abrufen der Banns" }, { status: 500 })
    }

    return NextResponse.json({ bans: data })
  } catch (error) {
    console.error("Fehler:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
