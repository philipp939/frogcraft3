import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const banId = Number.parseInt(params.id)

    const { error } = await supabase.from("bans").update({ is_active: false }).eq("id", banId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Entfernen des Bans:", error)
    return NextResponse.json({ error: "Fehler beim Entfernen des Bans" }, { status: 500 })
  }
}
