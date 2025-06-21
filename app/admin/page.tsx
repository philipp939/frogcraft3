"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crown, Gamepad2, Lock, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

type PvpMode = "forced_on" | "forced_off" | "player_choice"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [pvpMode, setPvpMode] = useState<PvpMode>("player_choice")

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "kahba") {
      setIsAuthenticated(true)
      setMessage(null)
    } else {
      setMessage({ type: "error", text: "Falsches Passwort!" })
    }
  }

  const handlePvpModeChange = (mode: PvpMode) => {
    setPvpMode(mode)
    const modeTexts = {
      forced_on: "PVP wurde für alle Spieler erzwungen (AN)",
      forced_off: "PVP wurde für alle Spieler erzwungen (AUS)",
      player_choice: "Spieler können PVP selbst aktivieren/deaktivieren",
    }
    setMessage({
      type: "success",
      text: modeTexts[mode],
    })
  }

  const getPvpModeDescription = (mode: PvpMode) => {
    switch (mode) {
      case "forced_on":
        return "PVP ist für alle Spieler aktiviert und kann nicht deaktiviert werden"
      case "forced_off":
        return "PVP ist für alle Spieler deaktiviert und kann nicht aktiviert werden"
      case "player_choice":
        return "Spieler können PVP individuell aktivieren oder deaktivieren"
    }
  }

  // Passwort-Eingabe anzeigen, wenn nicht authentifiziert
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-sm rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center">
              <Lock className="h-6 w-6 mr-2" />
              Admin-Zugang
            </CardTitle>
            <CardDescription className="text-gray-400">Passwort eingeben um fortzufahren</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Passwort
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 border-white/20 text-white rounded-lg"
                  placeholder="Passwort eingeben..."
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg">
                Anmelden
              </Button>
            </form>
            {message && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                <p className="text-red-300 text-sm">{message.text}</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
                Zurück zur Startseite
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setIsAuthenticated(false)}
                className="text-white hover:text-red-300 rounded-lg"
              >
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <Card
            className={`mb-8 rounded-xl ${message.type === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}
          >
            <CardContent className="pt-6">
              <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>{message.text}</p>
            </CardContent>
          </Card>
        )}

        {/* Server Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PVP Control */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                PVP Kontrolle
              </CardTitle>
              <CardDescription className="text-gray-400">Steuere PVP für alle Spieler auf dem Server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-white">PVP-Modus</Label>
                <Select value={pvpMode} onValueChange={(value: PvpMode) => handlePvpModeChange(value)}>
                  <SelectTrigger className="bg-black/20 border-white/20 text-white rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 rounded-lg">
                    <SelectItem value="player_choice" className="text-white hover:bg-gray-700 rounded-md">
                      Spieler entscheidet selbst
                    </SelectItem>
                    <SelectItem value="forced_on" className="text-white hover:bg-gray-700 rounded-md">
                      PVP für alle erzwingen (AN)
                    </SelectItem>
                    <SelectItem value="forced_off" className="text-white hover:bg-gray-700 rounded-md">
                      PVP für alle erzwingen (AUS)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
                <p className="text-sm text-gray-300">{getPvpModeDescription(pvpMode)}</p>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800">
                <p className="text-sm text-blue-300">
                  <strong>Hinweis:</strong> Wenn PVP erzwungen wird, können Spieler ihre PVP-Einstellung nicht mehr
                  ändern.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Server Stats */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Server Status
              </CardTitle>
              <CardDescription className="text-gray-400">Aktuelle Server-Informationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">PVP Status:</span>
                <span
                  className={`font-medium ${
                    pvpMode === "forced_on"
                      ? "text-red-400"
                      : pvpMode === "forced_off"
                        ? "text-orange-400"
                        : "text-green-400"
                  }`}
                >
                  {pvpMode === "forced_on"
                    ? "Erzwungen (AN)"
                    : pvpMode === "forced_off"
                      ? "Erzwungen (AUS)"
                      : "Optional"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server Version:</span>
                <span className="text-white">1.21.6</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server IP:</span>
                <code className="text-purple-400">frog-craft.de</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-black/40 border-white/10 backdrop-blur-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Schnellaktionen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Zur Hauptseite
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg"
                onClick={() => setMessage({ type: "success", text: "Server-Neustart geplant" })}
              >
                Server Neustart
              </Button>

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg"
                onClick={() => setMessage({ type: "success", text: "Backup erstellt" })}
              >
                Backup erstellen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
