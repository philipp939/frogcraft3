import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// GET: Ausstehende Aktionsanfragen für einen Spieler abrufen
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const apiKey = url.searchParams.get("key")
    const uuid = url.searchParams.get("uuid")
    const status = url.searchParams.get("status") || "pending"

    // API-Key prüfen
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    if (!uuid) {
      return NextResponse.json({ error: "UUID erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Aktionsanfragen abrufen
    const { data: actionRequests, error } = await supabase
      .from("action_requests")
      .select("*")
      .eq("uuid", uuid)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      actionRequests,
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Aktionsanfragen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

// POST: Status einer Aktionsanfrage aktualisieren
export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const apiKey = url.searchParams.get("key")

    // API-Key prüfen
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, status, responseMessage } = body

    if (!requestId || !status) {
      return NextResponse.json({ error: "Anfrage-ID und Status erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Aktionsanfrage aktualisieren
    const { error } = await supabase
      .from("action_requests")
      .update({
        status,
        processed_at: new Date().toISOString(),
        response_message: responseMessage || null,
      })
      .eq("id", requestId)

    if (error) throw error

    return NextResponse.json({
      message: "Aktionsanfrage erfolgreich aktualisiert",
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Aktionsanfrage:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
