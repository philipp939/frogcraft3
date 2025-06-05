import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username } = body

    // Validiere die Eingaben
    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Überprüfe, ob der Spieler bereits existiert
    const { data: existingPlayer } = await supabase
      .from("players")
      .select("username")
      .eq("username", username.toLowerCase())
      .single()

    if (existingPlayer) {
      return NextResponse.json({ error: "Spieler ist bereits registriert" }, { status: 400 })
    }

    // Spieler zur Datenbank hinzufügen
    const { error: insertError } = await supabase.from("players").insert([
      {
        username: username.toLowerCase(),
        joined_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        playtime_minutes: 0,
        pvp_enabled: false,
        verified: false,
        deaths: 0,
        kills: 0,
        bounty: 0,
      },
    ])

    if (insertError) throw insertError

    return NextResponse.json({
      message: "Du wurdest erfolgreich zur Whitelist hinzugefügt!",
    })
  } catch (error) {
    console.error("Fehler bei der Whitelist-Anfrage:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
