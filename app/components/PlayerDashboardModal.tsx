"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Search, RefreshCw, Sword, Coins, Wallet } from "lucide-react"

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
  const [message, setMessage] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null)

  const searchPlayer = async () => {
    if (!searchUsername.trim()) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/player-search?username=${encodeURIComponent(searchUsername)}`)
      const data = await response.json()

      if (response.ok && data.player) {
        setPlayerData(data.player)
      } else {
        setMessage({ type: "error", text: data.error || "Spieler nicht gefunden" })
        setPlayerData(null)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Laden der Spielerdaten" })
      setPlayerData(null)
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
        setMessage({ type: "success", text: "Daten erfolgreich aktualisiert" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Aktualisieren der Daten" })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePvpToggle = async (enabled: boolean) => {
    if (!playerData) return

    try {
      const response = await fetch("/api/player-pvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: playerData.username,
          pvp_enabled: enabled,
        }),
      })

      if (response.ok) {
        setPlayerData({ ...playerData, pvp_enabled: enabled, verified: false })
        setMessage({
          type: "warning",
          text: "Führe auf dem Server /verify aus um deine Änderungen zu bestätigen!",
        })
      } else {
        setMessage({ type: "error", text: "Fehler beim Ändern der PVP-Einstellung" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Ändern der PVP-Einstellung" })
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
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg">
          <User className="h-5 w-5 mr-2" />
          Spieler Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Spieler Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <Label htmlFor="username" className="text-gray-300">
              Minecraft Username
            </Label>
            <div className="flex gap-2">
              <Input
                id="username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Username eingeben..."
                className="bg-black/20 border-white/20 text-white rounded-lg"
              />
              <Button
                onClick={searchPlayer}
                disabled={isLoading || !searchUsername.trim()}
                className="bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-900/30 border-green-800 text-green-300"
                  : message.type === "warning"
                    ? "bg-yellow-900/30 border-yellow-800 text-yellow-300"
                    : "bg-red-900/30 border-red-800 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Player Data */}
          {playerData && (
            <div className="space-y-4">
              {/* Player Info Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Spieler Information</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshPlayerData}
                  disabled={isRefreshing}
                  className="border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
                >
                  {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-red-400 text-sm flex items-center">
                      <Sword className="h-4 w-4 mr-2" />
                      Kills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">{playerData.kills}</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-yellow-400 text-sm flex items-center">
                      <Coins className="h-4 w-4 mr-2" />
                      Bounty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">{playerData.bounty} €</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 text-sm flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      Balance
                    </CardTitle>
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
                      <Label htmlFor="pvp-toggle" className="text-white font-medium">
                        PVP aktiviert
                      </Label>
                      <p className="text-gray-400 text-sm">Andere Spieler können dich angreifen wenn aktiviert</p>
                    </div>
                    <Switch
                      id="pvp-toggle"
                      checked={playerData.pvp_enabled}
                      onCheckedChange={handlePvpToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Player Name */}
              <div className="text-center">
                <p className="text-gray-400">Spieler:</p>
                <p className="text-2xl font-bold text-purple-400">{playerData.username}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
