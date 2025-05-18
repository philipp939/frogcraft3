"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Check, X } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

interface Player {
  id: string
  username: string
  created_at: string
  last_login: string | null
  pvp_enabled?: boolean
  verified?: boolean
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Lade Spielerdaten aus der Datenbank
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setIsLoading(true)

        // Lade Spieler aus der Datenbank
        const { data: playersData, error: playersError } = await supabase.from("players").select("*").order("username")

        if (playersError) {
          console.error("Fehler beim Laden der Spieler:", playersError)
          return
        }

        // Lade Spielereinstellungen
        const { data: settingsData, error: settingsError } = await supabase
          .from("player_settings")
          .select("username, pvp_enabled, verified")

        if (settingsError && settingsError.code !== "PGRST116") {
          console.error("Fehler beim Laden der Einstellungen:", settingsError)
        }

        // Kombiniere Spieler mit ihren Einstellungen
        const playersWithSettings = playersData.map((player: Player) => {
          const settings = settingsData?.find((s: any) => s.username.toLowerCase() === player.username.toLowerCase())
          return {
            ...player,
            pvp_enabled: settings?.pvp_enabled || false,
            verified: settings?.verified || false,
          }
        })

        setPlayers(playersWithSettings)
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayers()
  }, [supabase])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Zurück zur Startseite
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Moderator-Bereich</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Spieler ({players.length})</h2>
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700/50">
                        <th className="text-left py-3 px-4 font-medium">Benutzername</th>
                        <th className="text-left py-3 px-4 font-medium">Registriert am</th>
                        <th className="text-left py-3 px-4 font-medium">Letzter Login</th>
                        <th className="text-left py-3 px-4 font-medium">PVP</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player) => (
                        <tr key={player.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                          <td className="py-3 px-4">{player.username}</td>
                          <td className="py-3 px-4">
                            {player.created_at
                              ? new Date(player.created_at).toLocaleString("de-DE", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Unbekannt"}
                          </td>
                          <td className="py-3 px-4">
                            {player.last_login
                              ? new Date(player.last_login).toLocaleString("de-DE", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Nie"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                player.pvp_enabled ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
                              }`}
                            >
                              {player.pvp_enabled ? "Aktiviert" : "Deaktiviert"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {player.pvp_enabled ? (
                              player.verified ? (
                                <div className="flex items-center text-green-400">
                                  <Check className="w-4 h-4 mr-1" />
                                  <span>Verifiziert</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-yellow-400">
                                  <X className="w-4 h-4 mr-1" />
                                  <span>Nicht verifiziert</span>
                                </div>
                              )
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Gebannte Spieler</h2>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <p className="text-gray-400">Keine gebannten Spieler gefunden.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Chat-Protokoll</h2>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <p className="text-gray-400">Diese Funktion wird in einer zukünftigen Version verfügbar sein.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} FrogCraft Minecraft Server</p>
      </footer>
    </div>
  )
}
