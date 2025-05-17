"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface Setting {
  name: string
  displayName: string
  description: string
  value: boolean
  requiresModApproval: boolean
  category: string
}

interface SettingsPanelProps {
  username: string
  initialSettings: Setting[]
}

export default function SettingsPanel({ username, initialSettings }: SettingsPanelProps) {
  const [settings, setSettings] = useState<Setting[]>(initialSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Gruppiere Einstellungen nach Kategorie
  const settingsByCategory = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    },
    {} as Record<string, Setting[]>,
  )

  // Update the handleToggle function to show a different message
  const handleToggle = async (settingName: string, newValue: boolean) => {
    // Optimistisches UI-Update
    setSettings((prev) =>
      prev.map((setting) => (setting.name === settingName ? { ...setting, value: newValue } : setting)),
    )

    setIsLoading(true)
    setMessage(null)

    try {
      // Einstellung aktualisieren
      const response = await fetch("/api/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          settings: {
            [settingName]: newValue,
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ein Fehler ist aufgetreten")
      }

      // Für sicherheitsrelevante Einstellungen eine andere Nachricht anzeigen
      if (settingName === "pvp_enabled" || settings.find((s) => s.name === settingName)?.requiresModApproval) {
        setMessage({
          type: "success",
          text: "Anfrage wurde eingereicht und muss im Spiel bestätigt werden",
        })
      } else {
        setMessage({
          type: "success",
          text: "Einstellung erfolgreich aktualisiert",
        })
      }

      // Nach 5 Sekunden die Erfolgsmeldung ausblenden
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ein Fehler ist aufgetreten",
      })

      // UI-Update rückgängig machen
      setSettings((prev) =>
        prev.map((setting) => (setting.name === settingName ? { ...setting, value: !newValue } : setting)),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
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

      {Object.entries(settingsByCategory).map(([category, categorySettings]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold capitalize">{category}</h3>

          <div className="space-y-4">
            {categorySettings.map((setting) => (
              <div
                key={setting.name}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  setting.requiresModApproval ? "border-yellow-800 bg-yellow-900/10" : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{setting.displayName}</h4>
                    {setting.requiresModApproval && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-900/50 text-yellow-300">
                        Erfordert Genehmigung
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>

                <Switch
                  checked={setting.value}
                  onCheckedChange={(checked) => handleToggle(setting.name, checked)}
                  disabled={isLoading || setting.requiresModApproval}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
