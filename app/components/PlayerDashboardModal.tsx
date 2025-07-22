"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Search, Trophy, Coins, Wallet, RefreshCw, AlertTriangle } from "lucide-react"

interface PlayerData {
  username: string
  kills: number
  bounty: number
  balance: number
  pvp_enabled: boolean
  verified: boolean
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
      console.error("Fehler beim Aktualisieren der Daten:", error)
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
          pvp_enabled: newPvpStatus,
        }),
      })

      if (response.ok) {
        setPlayerData({
          ...playerData,
          pvp_enabled: newPvpStatus,
          verified: false,
        })
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des PVP-Status:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchPlayer()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg">
          <User className="h-5 w-5 mr-2" />
          Spieler Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black/90 border-white/10 text-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-400">Spieler Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Spieler Suche */}
          <Card className="bg-black/40 border-white/10 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Spieler suchen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="username" className="text-gray-300">
                    Minecraft Username
                  </Label>
                  <Input
                    id="username"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Username eingeben..."
                    className="bg-black/20 border-white/20 text-white rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={searchPlayer}
                    disabled={isLoading || !searchUsername.trim()}
                    className="bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    {isLoading ? "Suche..." : "Suchen"}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10 rounded-lg">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Spieler Informationen */}
          {playerData && (
            <Card className="bg-black/40 border-white/10 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Spieler Informationen
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
              <CardContent className="space-y-6">
                {/* Spieler Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
                    <div className="flex items-center mb-2">
                      <Trophy className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-red-400 font-medium">Kills</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{playerData.kills}</p>
                  </div>

                  <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
                    <div className="flex items-center mb-2">
                      <Coins className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 font-medium">Bounty</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{playerData.bounty} €</p>
                  </div>

                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
                    <div className="flex items-center mb-2">
                      <Wallet className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-400 font-medium">Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{playerData.balance} €</p>
                  </div>
                </div>

                {/* PVP Einstellungen */}
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">PVP Status</h4>
                      <p className="text-gray-400 text-sm">Aktiviere oder deaktiviere PVP für deinen Spieler</p>
                    </div>
                    <Switch checked={playerData.pvp_enabled} onCheckedChange={togglePvP} />
                  </div>
                </div>

                {/* Verification Warning */}
                {!playerData.verified && (
                  <Alert className="border-yellow-500/50 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-400">
                      Führe auf dem Server /verify aus um deine Änderungen zu bestätigen!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
