"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { User, Search, RefreshCw } from "lucide-react"

interface PlayerData {
  username: string
  kills: number
  deaths: number
  bounty: number
  balance: number
  pvp_enabled: boolean
  verified: boolean
  playtime_minutes: number
  joined_at: string
  last_seen: string
}

export default function PlayerDashboardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchUsername, setSearchUsername] = useState("")
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchPlayer = async () => {
    if (!searchUsername.trim()) return

    setIsLoading(true)
    setError(null)
    setPlayerData(null)

    try {
      const response = await fetch(`/api/player-search?username=${encodeURIComponent(searchUsername)}`)
      const data = await response.json()

      if (response.ok && data.player) {
        setPlayerData(data.player)
      } else {
        setError(data.error || "Spieler nicht gefunden")
      }
    } catch (error) {
      setError("Fehler beim Laden der Spielerdaten")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPlayerData = async () => {
    if (!playerData) return

    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/player-search?username=${encodeURIComponent(playerData.username)}`)
      const data = await response.json()

      if (response.ok && data.player) {
        setPlayerData(data.player)
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const togglePvP = async () => {
    if (!playerData) return

    const newPvpStatus = !playerData.pvp_enabled

    try {
      const response = await fetch("/api/player-pvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: playerData.username,
          pvpEnabled: newPvpStatus,
        }),
      })

      if (response.ok) {
        setPlayerData({
          ...playerData,
          pvp_enabled: newPvpStatus,
          verified: false, // PVP-Änderung erfordert Verifikation
        })
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des PVP-Status:", error)
    }
  }

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg">
          <User className="h-5 w-5 mr-2" />
          Spieler Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-black/90 border-white/10 text-white rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Spieler Dashboard</DialogTitle>
        </DialogHeader>

        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="username" className="text-gray-300">
                Minecraft Username
              </Label>
              <Input
                id="username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchPlayer()}
                className="bg-black/20 border-white/20 text-white rounded-lg"
                placeholder="Username eingeben..."
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={searchPlayer}
                disabled={isLoading || !searchUsername.trim()}
                className="bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Player Data */}
        {playerData && (
          <div className="space-y-6 mt-6">
            {/* Player Info Header */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {playerData.username}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshPlayerData}
                    disabled={isRefreshing}
                    className="border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Beigetreten</p>
                    <p className="text-white font-medium">{formatDate(playerData.joined_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Zuletzt online</p>
                    <p className="text-white font-medium">{formatDate(playerData.last_seen)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Spielzeit</p>
                    <p className="text-white font-medium">{formatPlaytime(playerData.playtime_minutes)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black/40 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-400 text-sm">Kills</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{playerData.kills}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-400 text-sm">Deaths</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{playerData.deaths}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-400 text-sm">Bounty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{playerData.bounty} €</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 text-sm">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{playerData.balance} €</p>
                </CardContent>
              </Card>
            </div>

            {/* PVP Settings */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">PVP Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">PVP Status</Label>
                    <p className="text-gray-400 text-sm">Aktiviere oder deaktiviere PVP für deinen Charakter</p>
                  </div>
                  <Switch checked={playerData.pvp_enabled} onCheckedChange={togglePvP} />
                </div>

                {!playerData.verified && (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      <strong>Verifikation erforderlich:</strong> Führe auf dem Server /verify aus um deine Änderungen
                      zu bestätigen!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
