"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gamepad2, Trophy, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaderboardPlayer {
  username: string
  kills?: number
  bounty?: number
}

export default function HomePage() {
  const [killsLeaderboard, setKillsLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [bountyLeaderboard, setBountyLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

    if (!username) {
      setError("Bitte gib deinen Minecraft-Namen ein.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Spieler suchen oder erstellen
      const response = await fetch(`/api/players/${encodeURIComponent(username)}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ein Fehler ist aufgetreten")
      }

      // Zur Spieler-Seite weiterleiten
      router.push(`/player/${encodeURIComponent(username.toLowerCase())}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
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
              <Link href="/admin" className="text-white hover:text-purple-300 transition-colors">
                Admin
              </Link>
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
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Dein Minecraft-Name"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Wird geladen..." : "Einstellungen anzeigen"}
              </Button>

              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
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
