"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Check, Loader2, X, AlertTriangle } from "lucide-react"
import { Switch } from "./ui/custom-switch"

interface PlayerSettingsProps {
  username: string
  onClose: () => void
}

export default function PlayerSettings({ username, onClose }: PlayerSettingsProps) {
  const [pvpEnabled, setPvpEnabled] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  // Lade die Spieler-ID und Einstellungen
  useEffect(() => {
    const loadPlayerAndSettings = async () => {
      try {
        setIsLoading(true)

        // Zuerst den Spieler finden oder erstellen
        const { data: playerData, error: playerError } = await supabase
          .from("players")
          .select("id")
          .eq("username", username.toLowerCase())
          .single()

        if (playerError && playerError.code !== "PGRST116") {
          console.error("Fehler beim Laden des Spielers:", playerError)
          setMessage({ type: "error", text: "Fehler beim Laden des Spielers" })
          return
        }

        let currentPlayerId = playerData?.id

        // Wenn der Spieler nicht existiert, erstelle ihn
        if (!currentPlayerId) {
          const { data: newPlayer, error: createError } = await supabase
            .from("players")
            .insert([{ username: username.toLowerCase() }])
            .select("id")
            .single()

          if (createError) {
            console.error("Fehler beim Erstellen des Spielers:", createError)
            setMessage({ type: "error", text: "Fehler beim Erstellen des Spielers" })
            return
          }

          currentPlayerId = newPlayer.id
        }

        setPlayerId(currentPlayerId)

        // Prüfe, ob die player_settings Tabelle existiert
        const { error: tableCheckError } = await supabase.rpc("create_player_settings_table")
        if (tableCheckError) {
          console.error("Fehler beim Prüfen/Erstellen der Tabelle:", tableCheckError)
        }

        // Lade die Einstellungen
        const { data: settingsData, error: settingsError } = await supabase
          .from("player_settings")
          .select("pvp_enabled, verified")
          .eq("username", username.toLowerCase())
          .single()

        if (settingsError && settingsError.code !== "PGRST116") {
          console.error("Fehler beim Laden der Einstellungen:", settingsError)
          setMessage({ type: "error", text: "Fehler beim Laden der Einstellungen" })
        } else if (settingsData) {
          setPvpEnabled(settingsData.pvp_enabled)
          setIsVerified(settingsData.verified)
        }
      } catch (err) {
        console.error("Fehler:", err)
        setMessage({ type: "error", text: "Ein unerwarteter Fehler ist aufgetreten" })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayerAndSettings()
  }, [username, supabase])

  // Speichere die Einstellungen
  const saveSettings = async () => {
    if (!playerId) {
      setMessage({ type: "error", text: "Spieler-ID nicht gefunden" })
      return
    }

    try {
      setIsSaving(true)
      setMessage(null)

      // Aktualisiere den letzten Login des Spielers
      await supabase.from("players").update({ last_login: new Date().toISOString() }).eq("id", playerId)

      // Speichere die Einstellungen
      const { error } = await supabase.from("player_settings").upsert(
        {
          username: username.toLowerCase(),
          pvp_enabled: pvpEnabled,
          verified: false, // Immer auf false setzen, wenn Einstellungen geändert werden
          updated_at: new Date().toISOString(),
        },
        { onConflict: "username" },
      )

      if (error) {
        throw error
      }

      setIsVerified(false) // Aktualisiere den Verifikationsstatus
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Einstellungen für {username}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Schließen">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">PVP aktivieren</h3>
                  <p className="text-sm text-gray-400">
                    Wenn aktiviert, kannst du andere Spieler angreifen und von ihnen angegriffen werden.
                  </p>
                  {!isVerified && pvpEnabled && (
                    <div className="flex items-center mt-2 text-yellow-400 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>Nicht verifiziert. Bestätige im Spiel mit /settings</span>
                    </div>
                  )}
                  {isVerified && pvpEnabled && (
                    <div className="flex items-center mt-2 text-green-400 text-sm">
                      <Check className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>Verifiziert</span>
                    </div>
                  )}
                </div>
                <Switch checked={pvpEnabled} onCheckedChange={setPvpEnabled} />
              </div>

              {/* Hier können später weitere Einstellungen hinzugefügt werden */}
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg mb-6 flex items-start ${
                  message.type === "success"
                    ? "bg-green-900/30 border border-green-800 text-green-300"
                    : "bg-red-900/30 border border-red-800 text-red-300"
                }`}
              >
                {message.type === "success" ? (
                  <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Speichern
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
