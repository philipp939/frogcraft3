"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Check, Loader2, X } from "lucide-react"
import { Switch } from "./ui/custom-switch"

interface PlayerDashboardProps {
  username: string
  onClose: () => void
}

interface PlayerData {
  uuid: string
  username: string
  joined_at: string
  last_seen: string
  playtime_minutes: number
  pvp_enabled: boolean
  deaths: number
  kills: number
}

export default function PlayerDashboard({ username, onClose }: PlayerDashboardProps) {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [pvpEnabled, setPvpEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClientSupabaseClient()

  // Lade Spielerdaten
  useEffect(() => {
    const loadPlayerData = async () => {
      if (!username) return

      try {
        setIsLoading(true)
        setMessage(null)

        // Spielerdaten laden
        const { data, error } = await supabase
          .from("players")
          .select("*")
          .ilike("username", username) // Case-insensitive Suche
          .limit(1)

        if (error) {
          console.error("Fehler beim Laden der Spielerdaten:", error)
          setMessage({ type: "error", text: "Fehler beim Laden der Spielerdaten" })
          return
        }

        if (data && data.length > 0) {
          setPlayerData(data[0])
          setPvpEnabled(data[0].pvp_enabled)
        } else {
          console.log("Kein Spieler gefunden, erstelle neuen Spieler")
          // Kein Spieler gefunden, aber wir lassen den Benutzer trotzdem Einstellungen vornehmen
          setPlayerData(null)
        }
      } catch (err) {
        console.error("Fehler:", err)
        setMessage({ type: "error", text: "Ein unerwarteter Fehler ist aufgetreten" })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayerData()
  }, [username, supabase])

  // Speichere die Einstellungen
  const saveSettings = async () => {
    try {
      setIsSaving(true)
      setMessage(null)

      if (playerData) {
        // Spieler existiert bereits, aktualisiere Einstellungen
        const { error } = await supabase
          .from("players")
          .update({
            pvp_enabled: pvpEnabled,
            last_seen: new Date().toISOString(),
          })
          .eq("uuid", playerData.uuid)

        if (error) throw error
      } else {
        // Neuen Spieler erstellen
        const { error } = await supabase.from("players").insert([
          {
            username: username,
            pvp_enabled: pvpEnabled,
            joined_at: new Date().toISOString(),
            last_seen: new Date().toISOString(),
            playtime_minutes: 0,
            deaths: 0,
            kills: 0,
          },
        ])

        if (error) throw error
      }

      setMessage({
        type: "success",
        text: "Einstellungen gespeichert. Du musst deine Änderungen im Spiel mit /settings bestätigen.",
      })

      // Nachricht nach 5 Sekunden ausblenden
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (err) {
      console.error("Fehler beim Speichern:", err)
      setMessage({ type: "error", text: "Fehler beim Speichern der Einstellungen" })
    } finally {
      setIsSaving(false)
    }
  }

  // Format playtime (minutes to hours and minutes)
  const formatPlaytime = (minutes: number) => {
    if (!minutes) return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format date
  const formatDate = (dateString: string) => {
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

  // Calculate K/D ratio
  const calculateKD = (kills: number, deaths: number) => {
    if (deaths === 0) return kills > 0 ? Number.POSITIVE_INFINITY : 0
    return kills / deaths
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-gray-800 rounded-3xl border border-gray-700 p-6 w-full max-w-md shadow-xl"
        style={{ borderRadius: "24px" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Spieler: {username}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {message && (
              <div
                className="p-4 rounded-2xl mb-6 flex items-start"
                style={{
                  borderRadius: "16px",
                  backgroundColor: message.type === "success" ? "rgba(22, 101, 52, 0.3)" : "rgba(153, 27, 27, 0.3)",
                  borderColor: message.type === "success" ? "rgb(22, 101, 52)" : "rgb(153, 27, 27)",
                  borderWidth: "1px",
                  color: message.type === "success" ? "rgb(134, 239, 172)" : "rgb(252, 165, 165)",
                }}
              >
                {message.type === "success" ? (
                  <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div className="space-y-6">
              <div
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-2xl border border-gray-600/50"
                style={{ borderRadius: "16px" }}
              >
                <div>
                  <h3 className="font-medium text-white">PVP aktivieren</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Wenn aktiviert, kannst du andere Spieler angreifen und von ihnen angegriffen werden.
                  </p>
                </div>
                <Switch checked={pvpEnabled} onCheckedChange={setPvpEnabled} />
              </div>

              {playerData && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-3 bg-gray-700/50 rounded-2xl border border-gray-600/50"
                    style={{ borderRadius: "16px" }}
                  >
                    <p className="text-sm text-gray-400">Spielzeit</p>
                    <p className="font-medium">{formatPlaytime(playerData.playtime_minutes)}</p>
                  </div>
                  <div
                    className="p-3 bg-gray-700/50 rounded-2xl border border-gray-600/50"
                    style={{ borderRadius: "16px" }}
                  >
                    <p className="text-sm text-gray-400">K/D Ratio</p>
                    <p className="font-medium">
                      {calculateKD(playerData.kills, playerData.deaths) === Number.POSITIVE_INFINITY
                        ? "∞"
                        : calculateKD(playerData.kills, playerData.deaths).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: "9999px" }}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Speichern
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
