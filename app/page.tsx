"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Gamepad2, Trophy, Coins, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface LeaderboardPlayer {
  username: string
  kills?: number
  bounty?: number
}

interface PlayerData {
  username: string
  uuid: string
  kills: number
  bounty: number
  last_seen: string
  created_at: string
}

export default function HomePage() {
  const [killsLeaderboard, setKillsLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [bountyLeaderboard, setBountyLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [searchUsername, setSearchUsername] = useState("")
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [searchError, setSearchError] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(false) // Declare the error variable

  // Leaderboards laden (nur Top 5)
  useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        const response = await fetch("/api/leaderboard?page=1&limit=5")
        if (response.ok) {
          const data = await response.json()
          setKillsLeaderboard(data.kills || [])
          setBountyLeaderboard(data.bounty || [])
        }
      } catch (error) {
        console.error("Fehler beim Laden der Leaderboards:", error)
      }
    }

    loadLeaderboards()
  }, [])

  // Spielersuche
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchUsername.trim()) {
      setSearchError("Bitte gib deinen Minecraft-Namen ein.")
      setError(true) // Set error to true
      return
    }

    setIsSearching(true)
    setSearchError("")
    setPlayerData(null)
    setError(false) // Set error to false

    try {
      const response = await fetch(`/api/players/${encodeURIComponent(searchUsername.trim())}`)
      const data = await response.json()

      if (response.ok) {
        setPlayerData(data.player)
      } else {
        setSearchError(data.error || "Spieler nicht gefunden")
        setError(true) // Set error to true
      }
    } catch (error) {
      console.error("Fehler bei der Spielersuche:", error)
      setSearchError("Ein Fehler ist aufgetreten")
      setError(true) // Set error to true
    } finally {
      setIsSearching(false)
    }
  }

  const handleAdminClick = () => {
    const password = prompt("Admin-Passwort eingeben:")
    if (password === "kahba") {
      window.location.href = "/admin"
    } else if (password) {
      alert("Falsches Passwort!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">FrogCraft</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <button onClick={handleAdminClick} className="text-white hover:text-purple-300 transition-colors">
                Admin
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section mit Spielersuche */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Willkommen bei <span className="text-purple-400">FrogCraft</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dein ultimatives Minecraft-Erlebnis mit erweiterten Features, Spielerverwaltung und Community-Tools.
          </p>

          {/* Spielersuche */}
          <div className="w-full max-w-md mx-auto mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Minecraft-Benutzername
                </label>
                <Input
                  type="text"
                  id="username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Dein Minecraft-Name"
                  disabled={isSearching}
                />
              </div>

              <Button
                type="submit"
                disabled={isSearching}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Wird geladen..." : "Spieler suchen"}
              </Button>

              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-300 text-sm">{searchError}</p>
                </div>
              )}

              {playerData && (
                <div className="mt-4 p-4 bg-purple-900/30 border border-purple-800 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">{playerData.username}</h4>
                  <div className="space-y-1 text-purple-200">
                    <p>Kills: {playerData.kills}</p>
                    <p>Bounty: {playerData.bounty}</p>
                    <p>Zuletzt gesehen: {new Date(playerData.last_seen).toLocaleDateString("de-DE")}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Leaderboards - nur Top 5 */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Top 5 Leaderboards</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Kills Leaderboard */}
            <div className="leaderboard-card p-6">
              <div className="flex items-center mb-6">
                <Trophy className="h-6 w-6 text-red-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top 5 Kills</h4>
              </div>
              <div className="space-y-3">
                {killsLeaderboard.length > 0 ? (
                  killsLeaderboard.slice(0, 5).map((player, index) => (
                    <div key={player.username} className="leaderboard-item p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                            index === 0
                              ? "bg-yellow-500 text-black rounded-full"
                              : index === 1
                                ? "bg-gray-400 text-black rounded-full"
                                : index === 2
                                  ? "bg-amber-600 text-black rounded-full"
                                  : "bg-gray-600 text-white rounded-full"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{player.username}</span>
                      </div>
                      <span className="text-red-400 font-bold">{player.kills || 0} Kills</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>Noch keine Daten verfügbar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bounty Leaderboard */}
            <div className="leaderboard-card p-6">
              <div className="flex items-center mb-6">
                <Coins className="h-6 w-6 text-yellow-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top 5 Bounty</h4>
              </div>
              <div className="space-y-3">
                {bountyLeaderboard.length > 0 ? (
                  bountyLeaderboard.slice(0, 5).map((player, index) => (
                    <div key={player.username} className="leaderboard-item p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                            index === 0
                              ? "bg-yellow-500 text-black rounded-full"
                              : index === 1
                                ? "bg-gray-400 text-black rounded-full"
                                : index === 2
                                  ? "bg-amber-600 text-black rounded-full"
                                  : "bg-gray-600 text-white rounded-full"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{player.username}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{player.bounty || 0} Coins</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>Noch keine Daten verfügbar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Server Info */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Server Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Server IP</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-purple-400 text-lg font-mono">frog-craft.de</code>
                <p className="text-gray-400 mt-2">Minecraft Version 1.21.4</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Discord</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="https://discord.gg/H2yX7d8Bmv"
                  target="_blank"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Tritt unserer Community bei
                </Link>
                <p className="text-gray-400 mt-2">Für Support und Updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2025 FrogCraft. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
