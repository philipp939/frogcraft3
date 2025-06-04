"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Settings, Shield, Clock, Gamepad2 } from "lucide-react"
import Link from "next/link"

interface Player {
  id: number
  username: string
  uuid: string
  created_at: string
  last_login: string
  is_online: boolean
}

interface PlayerSettings {
  [key: string]: boolean
}

interface Ban {
  id: number
  reason: string
  banned_by: string
  banned_at: string
  expires_at: string | null
  is_active: boolean
  ban_type: string
}

export default function DashboardPage() {
  const [searchUsername, setSearchUsername] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({})
  const [playerBans, setPlayerBans] = useState<Ban[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const searchPlayer = async () => {
    if (!searchUsername.trim()) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/players/${encodeURIComponent(searchUsername)}`)

      if (!response.ok) {
        throw new Error("Spieler nicht gefunden")
      }

      const data = await response.json()
      setCurrentPlayer(data.player)
      setPlayerSettings(data.settings)
      setPlayerBans(data.bans || [])
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Laden der Spielerdaten",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = async (settingName: string, value: boolean) => {
    if (!currentPlayer) return

    try {
      const response = await fetch(`/api/players/${currentPlayer.username}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [settingName]: value }),
      })

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren der Einstellung")
      }

      setPlayerSettings((prev) => ({ ...prev, [settingName]: value }))
      setMessage({ type: "success", text: "Einstellung erfolgreich aktualisiert" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Aktualisieren",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">FrogCraft Dashboard</h1>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Spieler suchen
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gib deinen Minecraft-Benutzernamen ein, um deine Daten zu verwalten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Minecraft-Benutzername"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchPlayer()}
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button onClick={searchPlayer} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? "Suche..." : "Suchen"}
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Player Data */}
        {currentPlayer && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-black/40 border-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
                <User className="h-4 w-4 mr-2" />
                Übersicht
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                <Settings className="h-4 w-4 mr-2" />
                Einstellungen
              </TabsTrigger>
              <TabsTrigger value="bans" className="data-[state=active]:bg-purple-600">
                <Shield className="h-4 w-4 mr-2" />
                Bans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Spieler-Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Benutzername:</span>
                      <span className="text-white">{currentPlayer.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge variant={currentPlayer.is_online ? "default" : "secondary"}>
                        {currentPlayer.is_online ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Registriert:</span>
                      <span className="text-white">{formatDate(currentPlayer.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Letzter Login:</span>
                      <span className="text-white">
                        {currentPlayer.last_login ? formatDate(currentPlayer.last_login) : "Nie"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Schnell-Einstellungen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">PVP</span>
                      <Switch
                        checked={playerSettings.pvp_enabled || false}
                        onCheckedChange={(checked) => updateSetting("pvp_enabled", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Teleport-Schutz</span>
                      <Switch
                        checked={playerSettings.teleport_protection || false}
                        onCheckedChange={(checked) => updateSetting("teleport_protection", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Ban-Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {playerBans.filter((ban) => ban.is_active).length > 0 ? (
                      <Badge variant="destructive">Gebannt</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-600">
                        Nicht gebannt
                      </Badge>
                    )}
                    <p className="text-gray-400 text-sm mt-2">{playerBans.length} Ban(s) insgesamt</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Spieler-Einstellungen</CardTitle>
                  <CardDescription className="text-gray-400">
                    Verwalte deine persönlichen Spieleinstellungen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Kampf</h3>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
                        <div>
                          <p className="text-white">PVP aktiviert</p>
                          <p className="text-sm text-gray-400">Ermöglicht es anderen Spielern, dich zu töten</p>
                        </div>
                        <Switch
                          checked={playerSettings.pvp_enabled || false}
                          onCheckedChange={(checked) => updateSetting("pvp_enabled", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Schutz</h3>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
                        <div>
                          <p className="text-white">Teleport-Schutz</p>
                          <p className="text-sm text-gray-400">Verhindert ungewollte Teleportationen</p>
                        </div>
                        <Switch
                          checked={playerSettings.teleport_protection || false}
                          onCheckedChange={(checked) => updateSetting("teleport_protection", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Kommunikation</h3>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
                        <div>
                          <p className="text-white">Chat-Benachrichtigungen</p>
                          <p className="text-sm text-gray-400">Erhalte Benachrichtigungen für wichtige Events</p>
                        </div>
                        <Switch
                          checked={playerSettings.chat_notifications || false}
                          onCheckedChange={(checked) => updateSetting("chat_notifications", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Sozial</h3>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
                        <div>
                          <p className="text-white">Freundschaftsanfragen</p>
                          <p className="text-sm text-gray-400">
                            Andere Spieler können dir Freundschaftsanfragen senden
                          </p>
                        </div>
                        <Switch
                          checked={playerSettings.friend_requests || false}
                          onCheckedChange={(checked) => updateSetting("friend_requests", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bans">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Ban-Historie</CardTitle>
                  <CardDescription className="text-gray-400">
                    Übersicht über alle Bans für diesen Spieler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {playerBans.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Keine Bans vorhanden</p>
                  ) : (
                    <div className="space-y-4">
                      {playerBans.map((ban) => (
                        <div
                          key={ban.id}
                          className={`p-4 rounded-lg border ${
                            ban.is_active ? "border-red-500/50 bg-red-500/10" : "border-gray-500/50 bg-gray-500/10"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={ban.is_active ? "destructive" : "secondary"}>
                                  {ban.is_active ? "Aktiv" : "Abgelaufen"}
                                </Badge>
                                <Badge variant="outline" className="border-white/20 text-white">
                                  {ban.ban_type === "permanent" ? "Permanent" : "Temporär"}
                                </Badge>
                              </div>
                              <p className="text-white font-medium">Grund: {ban.reason}</p>
                              <p className="text-gray-400 text-sm">Gebannt von: {ban.banned_by}</p>
                              <p className="text-gray-400 text-sm">Gebannt am: {formatDate(ban.banned_at)}</p>
                              {ban.expires_at && (
                                <p className="text-gray-400 text-sm">Läuft ab: {formatDate(ban.expires_at)}</p>
                              )}
                            </div>
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
