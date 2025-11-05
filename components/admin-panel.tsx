"use client"

import { useState, useEffect } from "react"
import type { PvpSetting } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [pvpSetting, setPvpSetting] = useState<PvpSetting>("neutral")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPvpSetting()
  }, [])

  const fetchPvpSetting = async () => {
    try {
      const response = await fetch("/api/pvp-setting")
      const data = await response.json()
      setPvpSetting(data.setting)
    } catch (error) {
      console.error("Error fetching PVP setting:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetPvp = async (setting: PvpSetting) => {
    setSaving(true)
    try {
      const response = await fetch("/api/pvp-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting }),
      })
      if (response.ok) {
        setPvpSetting(setting)
      }
    } catch (error) {
      console.error("Error setting PVP:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-8">Lädt...</div>

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">PVP Modus</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Aktueller Modus: <span className="font-bold text-primary">{pvpSetting.toUpperCase()}</span>
          </p>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => handleSetPvp("enabled")}
              disabled={saving}
              variant={pvpSetting === "enabled" ? "default" : "outline"}
              className={pvpSetting === "enabled" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Erzwinge PVP An (Alle Spieler)
            </Button>
            <Button
              onClick={() => handleSetPvp("disabled")}
              disabled={saving}
              variant={pvpSetting === "disabled" ? "destructive" : "outline"}
            >
              Erzwinge PVP Aus (Alle Spieler)
            </Button>
            <Button
              onClick={() => handleSetPvp("neutral")}
              disabled={saving}
              variant={pvpSetting === "neutral" ? "default" : "outline"}
            >
              Neutral (Spieler entscheiden selbst)
            </Button>
          </div>

          <div className="mt-4 text-xs text-muted-foreground bg-background p-3 rounded">
            <p>
              <strong>Erzwinge An:</strong> PVP für alle Spieler aktiv - Spieler können nicht deaktivieren
            </p>
            <p>
              <strong>Erzwinge Aus:</strong> PVP für alle Spieler deaktiviert - Spieler können nicht aktivieren
            </p>
            <p>
              <strong>Neutral:</strong> Spieler können PVP für sich selbst einstellen
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
