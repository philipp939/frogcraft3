import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username.toLowerCase()
    const settings = await request.json()
    const supabase = createServerSupabaseClient()

    // Spieler abrufen
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("uuid")
      .eq("username", username)
      .single()

    if (playerError) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    // Einstellungen aktualisieren
    const updateData: any = {}
    if (settings.pvp_enabled !== undefined) {
      updateData.pvp_enabled = settings.pvp_enabled
    }
    if (settings.verified !== undefined) {
      updateData.verified = settings.verified
    }

    const { error: updateError } = await supabase.from("players").update(updateData).eq("uuid", player.uuid)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Einstellungen:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Einstellungen" }, { status: 500 })
  }
}
