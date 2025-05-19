"use client"

import { useState, useEffect } from "react"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Check, Loader2, X } from "lucide-react"
import { Switch } from "./ui/custom-switch"

interface PlayerSettingsProps {
  username: string
  onClose: () => void
}

export default function PlayerSettings({ username, onClose }: PlayerSettingsProps) {
  const [pvpEnabled, setPvpEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [playerUuid, setPlayerUuid] = useState<string | null>(null)
  const supabase = createServerSupabaseClient()

  // Lade die Spieler-ID und Einstellungen
  useEffect(() => {
    const loadPlayerSettings = async () => {
      try {
        setIsLoading(true)

        // Spieler und Einstellungen laden
        const { data, error } = await supabase
          .from("players")
          .select("uuid, pvp_enable")
          .eq("username", username.toLowerCase())
          .single()

        if (error) {
          console.error("Fehler beim Laden der Spielereinstellungen:", error)
          setMessage({ type: "error", text: "Fehler beim Laden der Einstellungen" })
          return
        }

        if (data) {
          setPlayerUuid(data.uuid)
          setPvpEnabled(data.pvp_enable)
        }
      } catch (err) {
        console.error("Fehler:", err)
        setMessage({ type: "error", text: "Ein unerwarteter Fehler ist aufgetreten" })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayerSettings()
  }, [username, supabase])

  // Speichere die Einstellungen
  const saveSettings = async () => {
    if (!playerUuid) {
      setMessage({ type: "error", text: "Spieler nicht gefunden" })
      return
    }

    try {
      setIsSaving(true)
      setMessage(null)

      // Aktualisiere die Spielereinstellungen
      const { error } = await supabase
        .from("players")
        .update({
          pvp_enable: pvpEnabled,
          last_seen: new Date().toISOString(),
        })
        .eq("uuid", playerUuid)

      if (error) {
        throw error
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
