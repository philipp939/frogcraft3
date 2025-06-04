import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

// Konvertiere exec zu einer Promise-basierten Funktion
const execAsync = promisify(exec)

// Konfiguration - diese Werte solltest du in einer .env-Datei speichern
const MINECRAFT_SERVER_PATH = process.env.MINECRAFT_SERVER_PATH || "/path/to/your/minecraft/server"
const WHITELIST_PATH = path.join(MINECRAFT_SERVER_PATH, "whitelist.json")
const SCREEN_SESSION_NAME = process.env.MINECRAFT_SCREEN_SESSION || "minecraft"
const API_SECRET_KEY = process.env.API_SECRET_KEY || "dein-geheimer-schlüssel"

// Funktion zum Überprüfen der Anfrage-Authentifizierung
function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${API_SECRET_KEY}`
}

export async function POST(request: Request) {
  try {
    // Überprüfe die Authentifizierung
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    // Lese den Request-Body
    const body = await request.json()
    const { username, discordTag } = body

    // Validiere die Eingaben
    if (!username || !discordTag) {
      return NextResponse.json({ error: "Minecraft-Benutzername und Discord-Tag sind erforderlich" }, { status: 400 })
    }

    // Überprüfe, ob die whitelist.json existiert
    if (!fs.existsSync(WHITELIST_PATH)) {
      return NextResponse.json({ error: "Whitelist-Datei nicht gefunden" }, { status: 500 })
    }

    // Lese die aktuelle Whitelist
    const whitelistContent = fs.readFileSync(WHITELIST_PATH, "utf-8")
    const whitelist = JSON.parse(whitelistContent)

    // Überprüfe, ob der Spieler bereits auf der Whitelist steht
    if (whitelist.some((player: any) => player.name.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ error: "Spieler ist bereits auf der Whitelist" }, { status: 400 })
    }

    // Speichere die Anfrage in einer separaten Datei zur Überprüfung
    const requestsPath = path.join(MINECRAFT_SERVER_PATH, "whitelist_requests.json")
    let requests = []

    if (fs.existsSync(requestsPath)) {
      const requestsContent = fs.readFileSync(requestsPath, "utf-8")
      requests = JSON.parse(requestsContent)
    }

    requests.push({
      username,
      discordTag,
      timestamp: new Date().toISOString(),
      status: "pending",
    })

    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2))

    // Optional: Füge den Spieler direkt zur Whitelist hinzu
    // Hinweis: Dies sollte nur aktiviert werden, wenn du eine zusätzliche Sicherheitsebene hast
    /*
    whitelist.push({
      uuid: "", // UUID wird vom Server beim Neuladen der Whitelist automatisch hinzugefügt
      name: username
    })
    
    fs.writeFileSync(WHITELIST_PATH, JSON.stringify(whitelist, null, 2))
    
    // Führe den Befehl aus, um die Whitelist neu zu laden
    try {
      await execAsync(`screen -S ${SCREEN_SESSION_NAME} -p 0 -X stuff 'whitelist reload\n'`)
    } catch (error) {
      console.error("Fehler beim Ausführen des Whitelist-Reload-Befehls:", error)
      // Wir geben trotzdem eine Erfolgsantwort zurück, da der Spieler zur Whitelist hinzugefügt wurde
    }
    */

    return NextResponse.json({
      message: "Deine Anfrage wurde erfolgreich eingereicht und wird überprüft.",
    })
  } catch (error) {
    console.error("Fehler bei der Whitelist-Anfrage:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
