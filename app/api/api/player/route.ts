import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// GET: Spielerinformationen abrufen
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Benutzername erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Spieler abrufen oder erstellen
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("username", username.toLowerCase())
      .single()

    if (playerError && playerError.code !== "PGRST116") {
      // PGRST116 = not found
      throw playerError
    }

    let playerId

    if (!player) {
      // Spieler erstellen, wenn nicht vorhanden
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert([{ username: username.toLowerCase() }])
        .select()
        .single()

      if (createError) throw createError
      playerId = newPlayer.id
    } else {
      playerId = player.id

      // Letzten Login aktualisieren
      await supabase.from("players").update({ last_login: new Date().toISOString() }).eq("id", playerId)
    }

    // Einstellungen abrufen
    const { data: settings, error: settingsError } = await supabase
      .from("player_settings")
      .select("setting_name, setting_value")
      .eq("player_id", playerId)

    if (settingsError) throw settingsError

    // Verfügbare Einstellungen abrufen
    const { data: availableSettings, error: availableError } = await supabase.from("available_settings").select("*")

    if (availableError) throw availableError

    // Statistiken abrufen
    const { data: stats, error: statsError } = await supabase
      .from("player_stats")
      .select("*")
      .eq("player_id", playerId)
      .single()

    // Wenn keine Statistiken vorhanden sind, erstellen wir einen leeren Eintrag
    if (statsError && statsError.code === "PGRST116") {
      await supabase.from("player_stats").insert([{ player_id: playerId }])
    }

    // Einstellungen in ein benutzerfreundliches Format umwandeln
    const playerSettings: Record<string, boolean> = {}
    settings?.forEach((setting) => {
      playerSettings[setting.setting_name] = setting.setting_value
    })

    // Alle verfügbaren Einstellungen mit Standardwerten zurückgeben
    const formattedSettings = availableSettings?.map((setting) => ({
      name: setting.name,
      displayName: setting.display_name,
      description: setting.description,
      value: playerSettings[setting.name] ?? setting.default_value,
      requiresModApproval: setting.requires_mod_approval,
      category: setting.category,
    }))

    return NextResponse.json({
      player: player || { id: playerId, username: username.toLowerCase() },
      settings: formattedSettings,
      stats: stats || {},
    })
  } catch (error) {
    console.error("Fehler beim Abrufen der Spielerinformationen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}

// Update the POST method to create action requests instead of directly modifying settings
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, settings } = body

    if (!username || !settings) {
      return NextResponse.json({ error: "Benutzername und Einstellungen erforderlich" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Spieler abrufen
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id, uuid")
      .eq("username", username.toLowerCase())
      .single()

    if (playerError) {
      return NextResponse.json({ error: "Spieler nicht gefunden" }, { status: 404 })
    }

    // Verfügbare Einstellungen abrufen
    const { data: availableSettings, error: availableError } = await supabase
      .from("available_settings")
      .select("name, requires_mod_approval")

    if (availableError) throw availableError

    // Einstellungen-Map erstellen
    const settingsMap = new Map()
    availableSettings?.forEach((setting) => {
      settingsMap.set(setting.name, setting.requires_mod_approval)
    })

    // Aktionsanfragen erstellen für sicherheitsrelevante Einstellungen
    const actionPromises = []

    for (const [settingName, settingValue] of Object.entries(settings)) {
      // Prüfen, ob die Einstellung existiert
      if (!settingsMap.has(settingName)) {
        continue
      }

      // Für sicherheitsrelevante Einstellungen eine Aktionsanfrage erstellen
      if (settingName === "pvp_enabled" || settingsMap.get(settingName)) {
        const { data, error } = await supabase
          .from("action_requests")
          .insert([
            {
              uuid: player.uuid,
              action: `toggle_${settingName}:${settingValue}`,
              status: "pending",
              origin: "website",
            },
          ])
          .select()

        if (error) throw error
        actionPromises.push(data)
      } else {
        // Nicht-sicherheitsrelevante Einstellungen direkt aktualisieren
        // Bestehende Einstellung suchen
        const { data: existingSetting } = await supabase
          .from("player_settings")
          .select("id")
          .eq("player_id", player.id)
          .eq("setting_name", settingName)
          .single()

        if (existingSetting) {
          // Einstellung aktualisieren
          await supabase
            .from("player_settings")
            .update({
              setting_value: settingValue,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSetting.id)
        } else {
          // Einstellung erstellen
          await supabase.from("player_settings").insert([
            {
              player_id: player.id,
              setting_name: settingName,
              setting_value: settingValue,
            },
          ])
        }
      }
    }

    return NextResponse.json({
      message: "Einstellungsänderungen wurden eingereicht und warten auf Bestätigung im Spiel",
    })
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Einstellungen:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
