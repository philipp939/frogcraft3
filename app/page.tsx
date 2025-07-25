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

interface ServerInfoCard {
  id: string
  title: string
  content: string
  type: "text"
}

export default function HomePage() {
  const [killsLeaderboard, setKillsLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [bountyLeaderboard, setBountyLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [balanceLeaderboard, setBalanceLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [serverInfoCards, setServerInfoCards] = useState<ServerInfoCard[]>([])

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

  // Server Info Karten laden
  useEffect(() => {
    const loadServerInfo = async () => {
      try {
        const response = await fetch("/api/server-info")
        if (response.ok) {
          const data = await response.json()
          setServerInfoCards(data.cards || [])
        }
      } catch (error) {
        console.error("Fehler beim Laden der Server Info:", error)
      }
    }

    loadServerInfo()
  }, [])

  // Markdown-Links parsen
  const parseMarkdownLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(text)) !== null) {
      // Text vor dem Link hinzufügen
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }

      // Link hinzufügen
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline font-bold"
        >
          {match[1]}
        </a>,
      )

      lastIndex = match.index + match[0].length
    }

    // Restlichen Text hinzufügen
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const renderServerInfoCard = (card: ServerInfoCard) => {
    const contentLines = card.content.split("\n")

    return (
      <Card key={card.id} className="bg-black/40 border-white/10 backdrop-blur-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-white">{card.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {contentLines.map((line, index) => (
              <div key={index} className="text-gray-300">
                {parseMarkdownLinks(line)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid-Klassen basierend auf Anzahl der Karten
  const getGridClass = (cardCount: number) => {
    switch (cardCount) {
      case 1:
        return "grid-cols-1 max-w-md"
      case 2:
        return "grid-cols-1 sm:grid-cols-2 max-w-4xl"
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl"
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl"
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl"
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
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-purple-300 rounded-lg">
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
            Ein deutscher Minecraft Vanilla+ Server mit erweiterten Features.
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
            <div className="leaderboard-card p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <Trophy className="h-6 w-6 text-red-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top Kills</h4>
              </div>
              <div className="space-y-3">
                {killsLeaderboard.length > 0 ? (
                  killsLeaderboard.slice(0, 5).map((player, index) => (
                    <div
                      key={player.username}
                      className="leaderboard-item p-3 flex items-center justify-between rounded-lg"
                    >
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
            <div className="leaderboard-card p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <Coins className="h-6 w-6 text-yellow-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top Bounty</h4>
              </div>
              <div className="space-y-3">
                {bountyLeaderboard.length > 0 ? (
                  bountyLeaderboard.slice(0, 5).map((player, index) => (
                    <div
                      key={player.username}
                      className="leaderboard-item p-3 flex items-center justify-between rounded-lg"
                    >
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
                      <span className="text-yellow-400 font-bold">{player.bounty || 0} €</span>
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
            <div className="leaderboard-card p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <Wallet className="h-6 w-6 text-green-400 mr-2" />
                <h4 className="text-xl font-bold text-white">Top Balance</h4>
              </div>
              <div className="space-y-3">
                {balanceLeaderboard.length > 0 ? (
                  balanceLeaderboard.slice(0, 5).map((player, index) => (
                    <div
                      key={player.username}
                      className="leaderboard-item p-3 flex items-center justify-between rounded-lg"
                    >
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
                      <span className="text-green-400 font-bold">{player.balance || 0} €</span>
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
          <div className={`grid gap-8 mx-auto ${getGridClass(serverInfoCards.length)}`}>
            {serverInfoCards.map(renderServerInfoCard)}
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
