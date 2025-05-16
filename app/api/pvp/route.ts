// app/api/pvp/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Supabase Initialisierung
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const apiSecret = process.env.API_SECRET_KEY;

if (!supabaseUrl || !supabaseKey || !apiSecret) {
  throw new Error("Supabase oder API-Konfiguration fehlt in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/pvp – Spieler registrieren
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername fehlt." }, { status: 400 });
    }

    const cleanName = username.trim().toLowerCase();

    const { data: existing, error: selectError } = await supabase
      .from("pvp_players")
      .select("username")
      .eq("username", cleanName)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // Fehler beim Abfragen (außer "not found")
      console.error("Supabase SELECT-Fehler:", selectError);
      return NextResponse.json({ error: "Fehler beim Abfragen der Datenbank." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: "PVP ist bereits aktiviert." }, { status: 409 });
    }

    const { error: insertError } = await supabase
      .from("pvp_players")
      .insert([{ username: cleanName, activated_at: new Date().toISOString() }]);

    if (insertError) {
      console.error("Supabase INSERT-Fehler:", insertError);
      return NextResponse.json({ error: "Spieler konnte nicht gespeichert werden." }, { status: 500 });
    }

    return NextResponse.json({ message: "PVP wurde erfolgreich aktiviert." });
  } catch (err) {
    console.error("Fehler in POST /api/pvp:", err);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}

// GET /api/pvp?key=...
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (key !== apiSecret) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("pvp_players")
      .select("username");

    if (error) {
      console.error("Supabase SELECT-Fehler:", error);
      return NextResponse.json({ error: "Fehler beim Laden der Spieler." }, { status: 500 });
    }

    const usernames = data.map(player => player.username);

    return NextResponse.json({ players: usernames });
  } catch (err) {
    console.error("Fehler in GET /api/pvp:", err);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
