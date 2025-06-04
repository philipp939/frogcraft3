"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Shield, Plus, Trash2, Crown, Gamepad2, Calendar } from "lucide-react"
import Link from "next/link"

interface Player {
  id: number
  username: string
  uuid: string
  created_at: string
  last_login: string
  is_online: boolean
}

interface Ban {
  id: number
  player_id: number
  reason: string
  banned_by: string
  banned_at: string
  expires_at: string | null
  is_active: boolean
  ban_type: string
  player: { username: string }
}

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [bans, setBans] = useState<Ban[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Ban form state
  const [banForm, setBanForm] = useState({
    username: "",
    reason: "",
    banType: "temporary",
    duration: "1",
    bannedBy: "Admin",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [playersRes, bansRes] = await Promise.all([fetch("/api/admin/players"), fetch("/api/admin/bans")])

      if (playersRes.ok) {
        const playersData = await playersRes.json()
        setPlayers(playersData.players || [])
      }

      if (bansRes.ok) {
        const bansData = await bansRes.json()
        setBans(bansData.bans || [])
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Laden der Daten" })
    } finally {
      setIsLoading(false)
    }
  }

  const createBan = async () => {
    if (!banForm.username || !banForm.reason) {
      setMessage({ type: "error", text: "Benutzername und Grund sind erforderlich" })
      return
    }

    try {
      const response = await fetch("/api/admin/bans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Fehler beim Erstellen des Bans")
      }

      setMessage({ type: "success", text: "Ban erfolgreich erstellt" })
      setBanForm({ username: "", reason: "", banType: "temporary", duration: "1", bannedBy: "Admin" })
      loadData()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Erstellen des Bans",
      })
    }
  }

  const removeBan = async (banId: number) => {
    try {
      const response = await fetch(`/api/admin/bans/${banId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Fehler beim Entfernen des Bans")
      }

      setMessage({ type: "success", text: "Ban erfolgreich entfernt" })
      loadData()
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Entfernen des Bans" })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Admin-Panel...</div>
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
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <Card
            className={`mb-8 ${message.type === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}
          >
            <CardContent className="pt-6">
              <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>{message.text}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Gesamt Spieler</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{players.length}</div>
              <p className="text-xs text-gray-400">{players.filter((p) => p.is_online).length} online</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Aktive Bans</CardTitle>
              <Shield className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{bans.filter((b) => b.is_active).length}</div>
              <p className="text-xs text-gray-400">{bans.length} gesamt</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Heute registriert</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {
                  players.filter((p) => {
                    const today = new Date().toDateString()
                    const playerDate = new Date(p.created_at).toDateString()
                    return today === playerDate
                  }).length
                }
              </div>
              <p className="text-xs text-gray-400">Neue Spieler</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="bg-black/40 border-white/10">
            <TabsTrigger value="players" className="data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Spieler ({players.length})
            </TabsTrigger>
            <TabsTrigger value="bans" className="data-[state=active]:bg-purple-600">
              <Shield className="h-4 w-4 mr-2" />
              Bans ({bans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Spieler-Verwaltung</CardTitle>
                <CardDescription className="text-gray-400">Übersicht über alle registrierten Spieler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{player.username}</p>
                          <Badge variant={player.is_online ? "default" : "secondary"}>
                            {player.is_online ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">Registriert: {formatDate(player.created_at)}</p>
                        <p className="text-gray-400 text-sm">
                          Letzter Login: {player.last_login ? formatDate(player.last_login) : "Nie"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard?search=${player.username}`}>
                          <Button variant="outline" size="sm" className="border-white/20 text-white">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bans">
            <div className="space-y-6">
              {/* Create Ban */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Neuen Ban erstellen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="username" className="text-gray-300">
                        Benutzername
                      </Label>
                      <Input
                        id="username"
                        placeholder="Spielername"
                        value={banForm.username}
                        onChange={(e) => setBanForm((prev) => ({ ...prev, username: e.target.value }))}
                        className="bg-black/20 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banType" className="text-gray-300">
                        Ban-Typ
                      </Label>
                      <Select
                        value={banForm.banType}
                        onValueChange={(value) => setBanForm((prev) => ({ ...prev, banType: value }))}
                      >
                        <SelectTrigger className="bg-black/20 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temporary">Temporär</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-gray-300">
                        Dauer (Tage)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="1"
                        value={banForm.duration}
                        onChange={(e) => setBanForm((prev) => ({ ...prev, duration: e.target.value }))}
                        disabled={banForm.banType === "permanent"}
                        className="bg-black/20 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bannedBy" className="text-gray-300">
                        Gebannt von
                      </Label>
                      <Input
                        id="bannedBy"
                        placeholder="Admin"
                        value={banForm.bannedBy}
                        onChange={(e) => setBanForm((prev) => ({ ...prev, bannedBy: e.target.value }))}
                        className="bg-black/20 border-white/20 text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={createBan} className="w-full bg-red-600 hover:bg-red-700">
                        Ban erstellen
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="reason" className="text-gray-300">
                      Grund
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Grund für den Ban..."
                      value={banForm.reason}
                      onChange={(e) => setBanForm((prev) => ({ ...prev, reason: e.target.value }))}
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bans List */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Ban-Liste</CardTitle>
                  <CardDescription className="text-gray-400">Übersicht über alle Bans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bans.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Keine Bans vorhanden</p>
                    ) : (
                      bans.map((ban) => (
                        <div
                          key={ban.id}
                          className={`p-4 rounded-lg border ${
                            ban.is_active ? "border-red-500/50 bg-red-500/10" : "border-gray-500/50 bg-gray-500/10"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium">{ban.player.username}</p>
                                <Badge variant={ban.is_active ? "destructive" : "secondary"}>
                                  {ban.is_active ? "Aktiv" : "Abgelaufen"}
                                </Badge>
                                <Badge variant="outline" className="border-white/20 text-white">
                                  {ban.ban_type === "permanent" ? "Permanent" : "Temporär"}
                                </Badge>
                              </div>
                              <p className="text-gray-300">Grund: {ban.reason}</p>
                              <p className="text-gray-400 text-sm">Gebannt von: {ban.banned_by}</p>
                              <p className="text-gray-400 text-sm">Gebannt am: {formatDate(ban.banned_at)}</p>
                              {ban.expires_at && (
                                <p className="text-gray-400 text-sm">Läuft ab: {formatDate(ban.expires_at)}</p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeBan(ban.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
