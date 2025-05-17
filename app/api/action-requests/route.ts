// app/api/pvp/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Prüfe, ob die notwendigen Umgebungsvariablen gesetzt sind
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const apiSecretKey = process.env.API_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL und SUPABASE_KEY müssen als Umgebungsvariablen gesetzt sein.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich." }, { status: 400 });
    }

    const lowerUsername = username.toLowerCase();

    // Überprüfe, ob der Spieler bereits existiert
    const { data: existingPlayer, error: selectError } = await supabase
      .from('pvp_players')
      .select()
      .eq('username', lowerUsername)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error("Fehler beim Abrufen des Spielers:", selectError);
      return NextResponse.json({ error: "Fehler beim Überprüfen des Spielers." }, { status: 500 });
    }

    if (existingPlayer) {
      return NextResponse.json({ error: "PVP ist bereits für diesen Spieler aktiviert." }, { status: 400 });
    }

    const { error: insertError } = await supabase.from('pvp_players').insert([
      { username: lowerUsername, activated_at: new Date().toISOString() }
    ]);

    if (insertError) {
      console.error("Fehler beim Einfügen:", insertError);
      return NextResponse.json({ error: "Fehler beim Aktivieren von PVP." }, { status: 500 });
    }

    console.log(`PVP aktiviert für Spieler: ${lowerUsername}`);
    return NextResponse.json({
      message: "PVP wurde erfolgreich für deinen Account aktiviert!"
    });

  } catch (error) {
    console.error("Allgemeiner Fehler:", error);
    return NextResponse.json({ error: "Ein unerwarteter Fehler ist aufgetreten." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('key');

    if (!apiKey || apiKey !== apiSecretKey) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const { data: pvpPlayers, error } = await supabase
      .from('pvp_players')
      .select('username');

    if (error) {
      console.error("Fehler beim Abrufen der Spieler:", error);
      return NextResponse.json({ error: "Fehler beim Laden der Spieler." }, { status: 500 });
    }

    return NextResponse.json({
      players: pvpPlayers.map(player => player.username)
    });

  } catch (error) {
    console.error("Allgemeiner Fehler beim GET:", error);
    return NextResponse.json({ error: "Ein unerwarteter Fehler ist aufgetreten." }, { status: 500 });
  }
}

