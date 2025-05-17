// app/api/pvp/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL und SUPABASE_KEY müssen als Umgebungsvariablen gesetzt sein.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich." }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const lowerUsername = username.toLowerCase();

    const { data: existingPlayer, error: selectError } = await supabase
      .from('pvp_players')
      .select()
      .eq('username', lowerUsername)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error("Fehler beim Abrufen:", selectError);
      return NextResponse.json({ error: "Fehler beim Überprüfen des Spielers." }, { status: 500 });
    }

    if (existingPlayer) {
      return NextResponse.json({ error: "PVP ist bereits aktiviert." }, { status: 400 });
    }

    const { error: insertError } = await supabase.from('pvp_players').insert([
      { username: lowerUsername, activated_at: new Date().toISOString() }
    ]);

    if (insertError) {
      console.error("Fehler beim Einfügen:", insertError);
      return NextResponse.json({ error: "Fehler beim Aktivieren von PVP." }, { status: 500 });
    }

    return NextResponse.json({ message: "PVP wurde erfolgreich aktiviert!" });

  } catch (error) {
    console.error("Fehler in POST:", error);
    return NextResponse.json({ error: "Ein unerwarteter Fehler ist aufgetreten." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const apiKey = new URL(request.url).searchParams.get('key');

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    const { data: pvpPlayers, error } = await supabase
      .from('pvp_players')
      .select('username');

    if (error) {
      console.error("Fehler beim Abrufen:", error);
      return NextResponse.json({ error: "Fehler beim Laden der Spieler." }, { status: 500 });
    }

    return NextResponse.json({
      players: pvpPlayers.map(player => player.username)
    });

  } catch (error) {
    console.error("Fehler in GET:", error);
    return NextResponse.json({ error: "Ein unerwarteter Fehler ist aufgetreten." }, { status: 500 });
  }
}
