"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Clock, Skull, Swords, Ban } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"
import BanList from "../components/BanList"
import BanForm from "../components/BanForm"

interface Player {
  uuid: string
  username: string
  joined_at: string
  last_seen: string
  playtime_minutes: number
  pvp_enabled: boolean
  deaths: number
  kills: number
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [showBanForm, setShowBanForm] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState("")
  const supabase = createClientSupabaseClient()

  // Lade Spielerdaten aus der Datenbank
  const loadPlayers = async () => {
    try {
      setIsLoading(true)

      // Lade alle Spieler aus der Haupttabelle
      const { data, error } = await supabase.from("players").select("*").order("username")

      if (error) {
        console.error("Fehler beim Laden der Spieler:", error)
        return
      }

      setPlayers(data || [])
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPlayers()
  }, [supabase])

  // Format playtime (minutes to hours and minutes)
  const formatPlaytime = (minutes: number) => {
    if (!minutes) return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nie"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleBanPlayer = (username: string) => {
    setSelectedUsername(username)
    setShowBanForm(true)
  }

  const handleBanFormClose = () => {
    setShowBanForm(false)
    setSelectedUsername("")
  }

  const handleBanSuccess = () => {
    // Aktualisiere die Spielerliste nach erfolgreichem Bann
    loadPlayers()
  }

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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Spieler ({players.length})</h2>
                  <button
                    onClick={() => handleBanPlayer("")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Ban className="w-5 h-5 mr-2" />
                    Spieler bannen
                  </button>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-700/50">
                          <th className="text-left py-3 px-4 font-medium">Benutzername</th>
                          <th className="text-left py-3 px-4 font-medium">Registriert am</th>
                          <th className="text-left py-3 px-4 font-medium">Zuletzt online</th>
                          <th className="text-left py-3 px-4 font-medium">Spielzeit</th>
                          <th className="text-left py-3 px-4 font-medium">Kills</th>
                          <th className="text-left py-3 px-4 font-medium">Tode</th>
                          <th className="text-left py-3 px-4 font-medium">PVP</th>
                          <th className="text-left py-3 px-4 font-medium">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map((player) => (
                          <tr key={player.uuid} className="border-t border-gray-700 hover:bg-gray-700/30">
                            <td className="py-3 px-4">{player.username}</td>
                            <td className="py-3 px-4">
                              {player.joined_at ? formatDate(player.joined_at) : "Unbekannt"}
                            </td>
                            <td className="py-3 px-4">{formatDate(player.last_seen)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-blue-400" />
                                {formatPlaytime(player.playtime_minutes || 0)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Swords className="w-4 h-4 mr-1 text-green-400" />
                                {player.kills || 0}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Skull className="w-4 h-4 mr-1 text-red-400" />
                                {player.deaths || 0}
                              </div>
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
                              <button
                                onClick={() => handleBanPlayer(player.username)}
                                className="px-3 py-1 rounded-md text-xs bg-red-900/30 hover:bg-red-800/50 text-red-300 flex items-center"
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Bannen
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <BanList />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} FrogCraft Minecraft Server</p>
      </footer>

      {showBanForm && (
        <BanForm onClose={handleBanFormClose} onSuccess={handleBanSuccess} initialUsername={selectedUsername} />
      )}
    </div>
  )
}
