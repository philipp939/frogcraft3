"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, User, Settings, AlertTriangle } from "lucide-react"

interface Player {
  id: number
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

export default function PlayerDashboardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchUsername, setSearchUsername] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Simuliere PVP Force Status (in echter App würdest du das von der API holen)
  const [isPvpForced] = useState(false) // Du kannst das später dynamisch machen

  const searchPlayer = async () => {
    if (!searchUsername.trim()) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/leaderboard`)

      if (!response.ok) {
        throw new Error("Spieler nicht gefunden")
      }

      // Simuliere Spielerdaten (später echte API)
      const mockPlayer: Player = {
        id: 1,
        username: searchUsername,
        joined_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        playtime_minutes: 120,
        pvp_enabled: true,
        verified: false,
        deaths: 5,
        kills: 10,
        bounty: 500,
      }

      setCurrentPlayer(mockPlayer)
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Laden der Spielerdaten",
      })
    } finally {
      setIsLoading(false)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Users className="h-5 w-5 mr-2" />
          Spieler Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            Spieler Dashboard
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Verwalte deine Spielereinstellungen und sieh deine Statistiken ein
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <Search className="h-5 w-5 mr-2" />
                Spieler suchen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="text-gray-300">
                    Minecraft-Benutzername
                  </Label>
                  <Input
                    id="search"
                    placeholder="Dein Minecraft-Name"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchPlayer()}
                    className="bg-black/20 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={searchPlayer} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                    {isLoading ? "Suche..." : "Suchen"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          {message && (
            <Card
              className={`${message.type === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}
            >
              <CardContent className="pt-6">
                <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>{message.text}</p>
              </CardContent>
            </Card>
          )}

          {/* Player Data */}
          {currentPlayer && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Player Info */}
              <Card className="bg-black/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Spieler-Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Benutzername:</span>
                    <span className="text-white">{currentPlayer.username}</span>
                  </div>
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

              {/* PVP Settings */}
              <Card className="bg-black/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    PVP-Einstellungen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPvpForced && (
                    <div className="p-3 rounded-lg bg-orange-900/30 border border-orange-800">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-orange-400 mr-2" />
                        <p className="text-orange-300 text-sm">
                          PVP wird vom Server erzwungen und kann nicht geändert werden.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-600 bg-gray-800/50">
                    <div>
                      <p className="text-white">PVP aktiviert</p>
                      <p className="text-sm text-gray-400">
                        {isPvpForced ? "Vom Server erzwungen" : "Ermöglicht es anderen Spielern, dich zu töten"}
                      </p>
                    </div>
                    <Switch
                      checked={currentPlayer.pvp_enabled || isPvpForced}
                      disabled={isPvpForced}
                      onCheckedChange={(checked) => {
                        if (!isPvpForced) {
                          setCurrentPlayer((prev) => (prev ? { ...prev, pvp_enabled: checked } : null))
                          setMessage({
                            type: "success",
                            text: `PVP ${checked ? "aktiviert" : "deaktiviert"}`,
                          })
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
