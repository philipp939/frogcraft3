"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Crown, Trophy, Coins, Gamepad2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PlayerDashboardModal from "./components/PlayerDashboardModal"

interface LeaderboardPlayer {
  username: string
  kills?: number
  bounty?: number
  balance?: number
}

export default function HomePage() {
  const [killsLeaderboard, setKillsLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [bountyLeaderboard, setBountyLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [balanceLeaderboard, setBalanceLeaderboard] = useState<LeaderboardPlayer[]>([])

  // Leaderboards laden
  useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        if (response.ok) {
          const data = await response.json()
          setKillsLeaderboard(data.kills || [])
          setBountyLeaderboard(data.bounty || [])
          setBalanceLeaderboard(data.balance || [])
        }
      } catch (error) {
        console.error("Fehler beim Laden der Leaderboards:", error)
      }
    }

    loadLeaderboards()
  }, [])

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
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  <Crown className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Willkommen bei <span className="text-purple-400">FrogCraft</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dein ultimatives Minecraft-Erlebnis mit erweiterten Features, Spielerverwaltung und Community-Tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PlayerDashboardModal />
          </div>
        </div>
      </section>

      {/* Leaderboards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Leaderboards</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Kills Leaderboard */}
            <div className="leaderboard-card p-6">
              <div className="flex items-center mb-6">
                <Trophy className="h-6 w-6 text-red-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top Kills</h4>
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
                <h4 className="text-xl font-bold text-white">Top Bounty</h4>
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

            {/* Balance Leaderboard */}
            <div className="leaderboard-card p-6">
              <div className="flex items-center mb-6">
                <Wallet className="h-6 w-6 text-green-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top Balance</h4>
              </div>
              <div className="space-y-3">
                {balanceLeaderboard.length > 0 ? (
                  balanceLeaderboard.slice(0, 5).map((player, index) => (
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
                      <span className="text-green-400 font-bold">{player.balance || 0} $</span>
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
                <p className="text-gray-400 mt-2">Minecraft Version 1.21.6</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Server Start</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-400 text-lg font-bold">21.07.2025 um 19:00 Uhr</p>
                <p className="text-gray-400 mt-2">Sei dabei!</p>
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
