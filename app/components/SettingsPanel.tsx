"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface SettingsPanelProps {
  username: string
  initialSettings: {
    pvp_enabled: boolean
    verified: boolean
  }
}

export default function SettingsPanel({ username, initialSettings }: SettingsPanelProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleToggle = async (settingName: string, newValue: boolean) => {
    // Optimistisches UI-Update
    setSettings((prev) => ({ ...prev, [settingName]: newValue }))

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/players/${username}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [settingName]: newValue,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ein Fehler ist aufgetreten")
      }

      setMessage({
        type: "success",
        text: "Einstellung erfolgreich aktualisiert",
      })

      // Nach 3 Sekunden die Erfolgsmeldung ausblenden
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ein Fehler ist aufgetreten",
      })

      // UI-Update rückgängig machen
      setSettings((prev) => ({ ...prev, [settingName]: !newValue }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/30 border border-green-800 text-green-300"
              : "bg-red-900/30 border border-red-800 text-red-300"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Kampf-Einstellungen</h3>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="space-y-1">
            <h4 className="font-medium">PVP aktiviert</h4>
            <p className="text-sm text-gray-400">Ermöglicht es anderen Spielern, dich zu töten</p>
          </div>
          <Switch
            checked={settings.pvp_enabled}
            onCheckedChange={(checked) => handleToggle("pvp_enabled", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="space-y-1">
            <h4 className="font-medium">Verifiziert</h4>
            <p className="text-sm text-gray-400">Zeigt an, ob dein Account verifiziert ist</p>
          </div>
          <Switch
            checked={settings.verified}
            onCheckedChange={(checked) => handleToggle("verified", checked)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
