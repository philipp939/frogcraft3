"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Settings, Gamepad2 } from "lucide-react"
import Link from "next/link"

interface Player {
  uuid: string
  username: string
  joined_at: string
  last_seen: string
  playtime_minutes: number
  pvp_enabled: boolean
  verified: boolean
  deaths: number
  kills: number
  bounty: number
}

export default function DashboardPage() {
  const [searchUsername, setSearchUsername] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
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

      setCurrentPlayer((prev) => (prev ? { ...prev, [settingName]: value } : null))
      setMessage({ type: "success", text: "Einstellung erfolgreich aktualisiert" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Aktualisieren",
      })
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nie"
    return new Date(dateString).toLocaleString("de-DE")
  }

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
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
                      <span className="text-gray-400">Verifiziert:</span>
                      <Badge variant={currentPlayer.verified ? "default" : "secondary"}>
                        {currentPlayer.verified ? "Ja" : "Nein"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Beigetreten:</span>
                      <span className="text-white">{formatDate(currentPlayer.joined_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Zuletzt gesehen:</span>
                      <span className="text-white">{formatDate(currentPlayer.last_seen)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Statistiken</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Spielzeit:</span>
                      <span className="text-white">{formatPlaytime(currentPlayer.playtime_minutes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kills:</span>
                      <span className="text-white">{currentPlayer.kills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tode:</span>
                      <span className="text-white">{currentPlayer.deaths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bounty:</span>
                      <span className="text-white">{currentPlayer.bounty || 0} Coins</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">PVP-Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={currentPlayer.pvp_enabled ? "destructive" : "default"}>
                      {currentPlayer.pvp_enabled ? "PVP Aktiviert" : "PVP Deaktiviert"}
                    </Badge>
                    <p className="text-gray-400 text-sm mt-2">
                      {currentPlayer.pvp_enabled
                        ? "Du kannst von anderen Spielern getötet werden"
                        : "Du bist vor PVP geschützt"}
                    </p>
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
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
                    <div>
                      <p className="text-white">PVP aktiviert</p>
                      <p className="text-sm text-gray-400">Ermöglicht es anderen Spielern, dich zu töten</p>
                    </div>
                    <Switch
                      checked={currentPlayer.pvp_enabled}
                      onCheckedChange={(checked) => updateSetting("pvp_enabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
                    <div>
                      <p className="text-white">Account verifiziert</p>
                      <p className="text-sm text-gray-400">Zeigt an, ob dein Account verifiziert ist</p>
                    </div>
                    <Switch
                      checked={currentPlayer.verified}
                      onCheckedChange={(checked) => updateSetting("verified", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
