import { NextResponse } from "next/server"
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

    // Einfache Bestätigung - in der Realität würdest du das in einer Datenbank speichern
    console.log(`Whitelist-Anfrage: ${username} (${discordTag})`)

    return NextResponse.json({
      message: "Deine Anfrage wurde erfolgreich eingereicht und wird überprüft.",
    })
  } catch (error) {
    console.error("Fehler bei der Whitelist-Anfrage:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
