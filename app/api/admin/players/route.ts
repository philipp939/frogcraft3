import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ players })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spieler:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Spieler" }, { status: 500 })
  }
}
