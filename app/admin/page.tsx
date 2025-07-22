"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Crown, Gamepad2, Lock, Users, Shield, Zap, Settings, Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"

type PvpMode = "forced_on" | "forced_off" | "player_choice"

interface ServerInfoCard {
  id: string
  title: string
  content: string
  type: "text" | "link"
  url?: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [pvpMode, setPvpMode] = useState<PvpMode>("player_choice")
  const [isLoading, setIsLoading] = useState(false)
  const [serverInfoCards, setServerInfoCards] = useState<ServerInfoCard[]>([
    {
      id: "1",
      title: "Server IP",
      content: "IP wird ein paar Stunden vor Server Start hier stehen\nMinecraft Version 1.21.6",
      type: "text",
    },
    { id: "2", title: "Server Start", content: "21.07.2025 um 20:00 Uhr", type: "text" },
    {
      id: "3",
      title: "FrogCraft1 Modpack",
      content: "Download auf CurseForge",
      type: "link",
      url: "https://www.curseforge.com/minecraft/modpacks/frogcraft1",
    },
    {
      id: "4",
      title: "Discord Server",
      content: "Tritt unserer Community bei",
      type: "link",
      url: "https://discord.com/invite/H2yX7d8Bmv",
    },
    { id: "5", title: "Gewinnspiel", content: "20€ Preis!\nBalance-Leader nach 4 Wochen gewinnt", type: "text" },
  ])
  const [editingCard, setEditingCard] = useState<ServerInfoCard | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // PVP-Modus beim Laden abrufen
  useEffect(() => {
    const loadPvpMode = async () => {
      try {
        const response = await fetch("/api/admin/pvp-mode")
        if (response.ok) {
          const data = await response.json()
          setPvpMode(data.pvpMode)
        }
      } catch (error) {
        console.error("Fehler beim Laden des PVP-Modus:", error)
      }
    }

    if (isAuthenticated) {
      loadPvpMode()
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "kahba") {
      setIsAuthenticated(true)
      setMessage(null)
    } else {
      setMessage({ type: "error", text: "Falsches Passwort!" })
    }
  }

  const handlePvpModeChange = async (mode: PvpMode) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/pvp-mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pvpMode: mode,
          adminPassword: "kahba",
        }),
      })

      if (response.ok) {
        setPvpMode(mode)
        const modeTexts = {
          forced_on: "PVP wurde für alle Spieler erzwungen (AN) - Alle Spieler wurden aktualisiert",
          forced_off: "PVP wurde für alle Spieler erzwungen (AUS) - Alle Spieler wurden aktualisiert",
          player_choice: "Spieler können PVP selbst aktivieren/deaktivieren",
        }
        setMessage({
          type: "success",
          text: modeTexts[mode],
        })
      } else {
        throw new Error("Fehler beim Aktualisieren des PVP-Modus")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Fehler beim Aktualisieren des PVP-Modus",
      })
    } finally {
      setIsLoading(false)
    }
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

  const handleAddCard = () => {
    setEditingCard({ id: Date.now().toString(), title: "", content: "", type: "text" })
    setIsEditDialogOpen(true)
  }

  const handleEditCard = (card: ServerInfoCard) => {
    setEditingCard({ ...card })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCard = (cardId: string) => {
    setServerInfoCards((cards) => cards.filter((card) => card.id !== cardId))
    setMessage({ type: "success", text: "Karte erfolgreich gelöscht" })
  }

  const handleSaveCard = () => {
    if (!editingCard) return

    if (editingCard.id && serverInfoCards.find((card) => card.id === editingCard.id)) {
      // Bearbeiten
      setServerInfoCards((cards) => cards.map((card) => (card.id === editingCard.id ? editingCard : card)))
      setMessage({ type: "success", text: "Karte erfolgreich aktualisiert" })
    } else {
      // Hinzufügen
      setServerInfoCards((cards) => [...cards, editingCard])
      setMessage({ type: "success", text: "Karte erfolgreich hinzugefügt" })
    }

    setIsEditDialogOpen(false)
    setEditingCard(null)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                <Select
                  value={pvpMode}
                  onValueChange={(value: PvpMode) => handlePvpModeChange(value)}
                  disabled={isLoading}
                >
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

        {/* Server Information Management */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Server Information Verwaltung
              </div>
              <Button onClick={handleAddCard} className="bg-purple-600 hover:bg-purple-700 rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Karte hinzufügen
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Verwalte die Server Information Karten auf der Hauptseite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serverInfoCards.map((card) => (
                <Card key={card.id} className="bg-black/20 border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm flex items-center justify-between">
                      {card.title}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCard(card)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCard(card.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-xs whitespace-pre-line">{card.content}</p>
                    {card.type === "link" && card.url && (
                      <p className="text-purple-400 text-xs mt-1">Link: {card.url}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

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
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Zur Hauptseite
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
                onClick={() => setMessage({ type: "success", text: "Server-Neustart geplant" })}
              >
                Server Neustart
              </Button>

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
                onClick={() => setMessage({ type: "success", text: "Backup erstellt" })}
              >
                Backup erstellen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Card Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCard?.id && serverInfoCards.find((card) => card.id === editingCard.id)
                ? "Karte bearbeiten"
                : "Neue Karte erstellen"}
            </DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-title" className="text-gray-300">
                  Titel
                </Label>
                <Input
                  id="card-title"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="bg-black/20 border-white/20 text-white rounded-lg"
                  placeholder="Kartentitel eingeben..."
                />
              </div>
              <div>
                <Label htmlFor="card-content" className="text-gray-300">
                  Inhalt
                </Label>
                <textarea
                  id="card-content"
                  value={editingCard.content}
                  onChange={(e) => setEditingCard({ ...editingCard, content: e.target.value })}
                  className="w-full h-24 bg-black/20 border border-white/20 text-white rounded-lg p-2 resize-none"
                  placeholder="Karteninhalt eingeben..."
                />
              </div>
              <div>
                <Label htmlFor="card-type" className="text-gray-300">
                  Typ
                </Label>
                <Select
                  value={editingCard.type}
                  onValueChange={(value: "text" | "link") => setEditingCard({ ...editingCard, type: value })}
                >
                  <SelectTrigger className="bg-black/20 border-white/20 text-white rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 rounded-lg">
                    <SelectItem value="text" className="text-white hover:bg-gray-700 rounded-md">
                      Text
                    </SelectItem>
                    <SelectItem value="link" className="text-white hover:bg-gray-700 rounded-md">
                      Link
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingCard.type === "link" && (
                <div>
                  <Label htmlFor="card-url" className="text-gray-300">
                    URL
                  </Label>
                  <Input
                    id="card-url"
                    value={editingCard.url || ""}
                    onChange={(e) => setEditingCard({ ...editingCard, url: e.target.value })}
                    className="bg-black/20 border-white/20 text-white rounded-lg"
                    placeholder="https://..."
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveCard} className="bg-purple-600 hover:bg-purple-700 rounded-lg">
                  Speichern
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10 rounded-lg"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
