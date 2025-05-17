// app/api/pvp/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Supabase-Client erstellen
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich" }, { status: 400 });
    }

    // Überprüfe, ob der Spieler bereits PVP aktiviert hat
    const { data: existingPlayer } = await supabase
      .from('pvp_players')
      .select()
      .eq('username', username.toLowerCase())
      .single();

    if (existingPlayer) {
      return NextResponse.json({ error: "PVP ist bereits für diesen Spieler aktiviert" }, { status: 400 });
    }

    // Füge den Spieler zur PVP-Liste hinzu
    await supabase.from('pvp_players').insert([
      { username: username.toLowerCase(), activated_at: new Date().toISOString() }
    ]);

    console.log(`PVP aktiviert für Spieler: ${username}`);

    return NextResponse.json({
      message: "PVP wurde erfolgreich für deinen Account aktiviert!",
    });
  } catch (error) {
    console.error("Fehler bei der PVP-Aktivierung:", error);
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 });
  }
}

// Neue Route zum Abrufen der PVP-Spieler
export async function GET(request: Request) {
  try {
    // API-Schlüssel aus der Anfrage überprüfen
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('key');
    
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Hole alle PVP-Spieler
    const { data: pvpPlayers, error } = await supabase
      .from('pvp_players')
      .select('username');

    if (error) throw error;

    return NextResponse.json({
      players: pvpPlayers.map(player => player.username)
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der PVP-Spieler:", error);
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 });
  }
}
