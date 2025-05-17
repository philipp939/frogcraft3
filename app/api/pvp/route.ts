import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Konfiguration - diese Werte solltest du in einer .env-Datei speichern
const MINECRAFT_SERVER_PATH = process.env.MINECRAFT_SERVER_PATH || "./minecraft-server"
const PVP_PLAYERS_PATH = path.join(MINECRAFT_SERVER_PATH, "pvp_players.json")

export async function POST(request: Request) {
  try {
    // Lese den Request-Body
    const body = await request.json()
    const { username } = body

    // Validiere die Eingaben
    if (!username) {
      return NextResponse.json({ error: "Minecraft-Benutzername ist erforderlich" }, { status: 400 })
    }

    // Stelle sicher, dass das Verzeichnis existiert
    if (!fs.existsSync(MINECRAFT_SERVER_PATH)) {
      fs.mkdirSync(MINECRAFT_SERVER_PATH, { recursive: true })
    }

    // Erstelle die pvp_players.json, falls sie nicht existiert
    if (!fs.existsSync(PVP_PLAYERS_PATH)) {
      fs.writeFileSync(PVP_PLAYERS_PATH, JSON.stringify([], null, 2))
    }

    // Lese die aktuelle PVP-Spielerliste
    const pvpPlayersContent = fs.readFileSync(PVP_PLAYERS_PATH, "utf-8")
    const pvpPlayers = JSON.parse(pvpPlayersContent)

    // Überprüfe, ob der Spieler bereits PVP aktiviert hat
    if (pvpPlayers.some((player: string) => player.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ error: "PVP ist bereits für diesen Spieler aktiviert" }, { status: 400 })
    }

    // Füge den Spieler zur PVP-Liste hinzu
    pvpPlayers.push(username)
    fs.writeFileSync(PVP_PLAYERS_PATH, JSON.stringify(pvpPlayers, null, 2))

    console.log(`PVP aktiviert für Spieler: ${username}`)

    return NextResponse.json({
      message: "PVP wurde erfolgreich für deinen Account aktiviert!",
    })
  } catch (error) {
    console.error("Fehler bei der PVP-Aktivierung:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
