import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()
    const settings = await request.json()

    // Spieler abrufen
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id")
      .eq("username", username)
      .single()

    if (playerError) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    // Einstellungen aktualisieren
    for (const [settingName, settingValue] of Object.entries(settings)) {
      await supabase.from("player_settings").upsert(
        {
          player_id: player.id,
          setting_name: settingName,
          setting_value: settingValue,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "player_id,setting_name",
        },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Einstellungen:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Einstellungen" }, { status: 500 })
  }
}
