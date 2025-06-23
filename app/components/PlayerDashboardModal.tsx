"use client"

import { useState, useEffect } from "react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, Search, User, Settings, AlertTriangle, Info } from "lucide-react"

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
  balance: number
}

type PvpMode = "forced_on" | "forced_off" | "player_choice"

export default function PlayerDashboardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchUsername, setSearchUsername] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [pvpMode, setPvpMode] = useState<PvpMode>("player_choice")
  const [pvpModeLoading, setPvpModeLoading] = useState(false)

  // PVP-Modus beim Öffnen des Modals laden
  useEffect(() => {
    if (isOpen) {
      const loadPvpMode = async () => {
        try {
          const response = await fetch("/api/admin/pvp-mode")
          if (response.ok) {
            const data = await response.json()
            setPvpMode(data.pvpMode)
            console.log("Loaded PVP Mode:", data.pvpMode) // Debug Log
          }
        } catch (error) {
          console.error("Fehler beim Laden des PVP-Modus:", error)
        }
      }
      loadPvpMode()
    }
  }, [isOpen])

  const searchPlayer = async () => {
    if (!searchUsername.trim()) return

    setIsLoading(true)
    setMessage(null)
    setCurrentPlayer(null)

    try {
      // Genau wie beim Leaderboard - einfacher GET Request
      const response = await fetch(`/api/player-search?username=${encodeURIComponent(searchUsername)}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Spieler nicht gefunden")
        }
        throw new Error("Fehler beim Laden der Spielerdaten")
      }

      const data = await response.json()
      console.log("Player data loaded:", data.player) // Debug Log
      setCurrentPlayer(data.player)
    } catch (error) {
      console.error("Fehler beim Laden der Spielerdaten:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Laden der Spielerdaten",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatLastSeen = (dateString: string) => {
    if (!dateString) return "Nie"

    const lastSeen = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - lastSeen.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      return "Gerade online"
    } else if (diffInHours < 24) {
      return `vor ${diffInHours} Stunde${diffInHours !== 1 ? "n" : ""}`
    } else if (diffInDays === 1) {
      return "vor 1 Tag"
    } else {
      return `vor ${diffInDays} Tagen`
    }
  }

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const isPvpForced = pvpMode !== "player_choice"
  const pvpForcedValue = pvpMode === "forced_on"

  const getPvpTooltipText = () => {
    if (pvpMode === "forced_on") {
      return "PVP wurde vom Server für alle Spieler erzwungen (AN)"
    } else if (pvpMode === "forced_off") {
      return "PVP wurde vom Server für alle Spieler erzwungen (AUS)"
    }
    return ""
  }

  const handlePvpToggle = async (checked: boolean) => {
    if (!currentPlayer) return

    console.log("PVP Toggle clicked:", { username: currentPlayer.username, checked, pvpMode }) // Debug Log

    setPvpModeLoading(true)
    try {
      const response = await fetch("/api/player-pvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentPlayer.username,
          pvpEnabled: checked,
        }),
      })

      console.log("PVP Toggle Response Status:", response.status) // Debug Log

      if (response.ok) {
        const responseData = await response.json()
        console.log("PVP Toggle Response Data:", responseData) // Debug Log

        setCurrentPlayer((prev) => (prev ? { ...prev, pvp_enabled: checked } : null))
        setMessage({
          type: "success",
          text: `PVP ${checked ? "aktiviert" : "deaktiviert"}`,
        })
      } else {
        const errorData = await response.json()
        console.error("PVP Toggle Error:", errorData) // Debug Log
        throw new Error(errorData.error || "Fehler beim Aktualisieren der PVP-Einstellung")
      }
    } catch (error) {
      console.error("PVP Toggle Exception:", error) // Debug Log
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Aktualisieren der PVP-Einstellung",
      })
    } finally {
      setPvpModeLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
            <Users className="h-5 w-5 mr-2" />
            Spieler Dashboard
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 rounded-xl">
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
            <Card className="bg-black/40 border-gray-700 rounded-xl">
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
                      className="bg-black/20 border-gray-600 text-white rounded-lg"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={searchPlayer}
                      disabled={isLoading}
                      className="bg-purple-600 hover:bg-purple-700 rounded-lg"
                    >
                      {isLoading ? "Suche..." : "Suchen"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debug Info */}
            {currentPlayer && (
              <Card className="bg-blue-900/20 border-blue-700 rounded-xl">
                <CardContent className="pt-6">
                  <p className="text-blue-300 text-sm">
                    Debug: PVP Mode = {pvpMode}, Player PVP = {currentPlayer.pvp_enabled ? "true" : "false"}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Message */}
            {message && (
              <Card
                className={`rounded-xl ${message.type === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}
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
                <Card className="bg-black/40 border-gray-700 rounded-xl">
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
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white">{currentPlayer.balance || 0} $</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Zuletzt online:</span>
                      <span className="text-white">{formatLastSeen(currentPlayer.last_seen)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* PVP Settings */}
                <Card className="bg-black/40 border-gray-700 rounded-xl">
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
                      <div className="flex items-center">
                        {isPvpForced ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Switch
                                  checked={pvpForcedValue}
                                  disabled={true}
                                  className="opacity-50 cursor-not-allowed"
                                />
                                <Info className="h-4 w-4 text-gray-400 ml-2" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 text-white rounded-lg">
                              <p>{getPvpTooltipText()}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Switch
                            checked={currentPlayer.pvp_enabled}
                            disabled={pvpModeLoading}
                            onCheckedChange={handlePvpToggle}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
