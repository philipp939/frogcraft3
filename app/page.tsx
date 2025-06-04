"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Gamepad2, Trophy, Coins, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaderboardPlayer {
  username: string
  kills?: number
  bounty?: number
}

interface PaginationInfo {
  page: number
  limit: number
  totalKills: number
  totalBounty: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function HomePage() {
  const [killsLeaderboard, setKillsLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [bountyLeaderboard, setBountyLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  // Leaderboards laden
  const loadLeaderboards = async (page = 1) => {
    try {
      const response = await fetch(`/api/leaderboard?page=${page}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setKillsLeaderboard(data.kills || [])
        setBountyLeaderboard(data.bounty || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Fehler beim Laden der Leaderboards:", error)
    }
  }

  useEffect(() => {
    loadLeaderboards(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
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
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin" className="text-white hover:text-purple-300 transition-colors">
                Admin
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

          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Users className="h-5 w-5 mr-2" />
                Spieler Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboards mit Pagination */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Leaderboards</h3>

          {/* Pagination Controls */}
          {pagination && (
            <div className="flex justify-center items-center mb-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>

              <span className="text-white">
                Seite {pagination.page} von {Math.ceil(pagination.totalKills / pagination.limit)}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                Weiter
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Kills Leaderboard */}
            <div className="leaderboard-card p-6">
              <div className="flex items-center mb-6">
                <Trophy className="h-6 w-6 text-red-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top Kills</h4>
              </div>
              <div className="space-y-3">
                {killsLeaderboard.length > 0 ? (
                  killsLeaderboard.map((player, index) => {
                    const globalRank = (currentPage - 1) * 5 + index + 1
                    return (
                      <div key={player.username} className="leaderboard-item p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                              globalRank === 1
                                ? "bg-yellow-500 text-black rounded-full"
                                : globalRank === 2
                                  ? "bg-gray-400 text-black rounded-full"
                                  : globalRank === 3
                                    ? "bg-amber-600 text-black rounded-full"
                                    : "bg-gray-600 text-white rounded-full"
                            }`}
                          >
                            {globalRank}
                          </div>
                          <span className="text-white font-medium">{player.username}</span>
                        </div>
                        <span className="text-red-400 font-bold">{player.kills || 0} Kills</span>
                      </div>
                    )
                  })
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
                  bountyLeaderboard.map((player, index) => {
                    const globalRank = (currentPage - 1) * 5 + index + 1
                    return (
                      <div key={player.username} className="leaderboard-item p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                              globalRank === 1
                                ? "bg-yellow-500 text-black rounded-full"
                                : globalRank === 2
                                  ? "bg-gray-400 text-black rounded-full"
                                  : globalRank === 3
                                    ? "bg-amber-600 text-black rounded-full"
                                    : "bg-gray-600 text-white rounded-full"
                            }`}
                          >
                            {globalRank}
                          </div>
                          <span className="text-white font-medium">{player.username}</span>
                        </div>
                        <span className="text-yellow-400 font-bold">{player.bounty || 0} Coins</span>
                      </div>
                    )
                  })
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
