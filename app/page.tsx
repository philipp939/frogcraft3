"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayerProfile } from "@/components/player-profile"
import { Leaderboard } from "@/components/leaderboard"
import { AdminPanel } from "@/components/admin-panel"
import type { PvpPlayer } from "@/lib/types"
import { getPlayerByUsername, updatePlayerPvpStatus, checkAndRollbackIfUnverified } from "@/lib/db"

export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [player, setPlayer] = useState<PvpPlayer | null>(null)
  const [loading, setLoading] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [showAdminButton, setShowAdminButton] = useState(false)
  const [pvpForced, setPvpForced] = useState<"enabled" | "disabled" | "neutral">("neutral")
  const [leaderboards, setLeaderboards] = useState<{
    bounty: PvpPlayer[]
    balance: PvpPlayer[]
    playtime: PvpPlayer[]
  } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [rollbackTimers, setRollbackTimers] = useState<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    setMounted(true)
    loadLeaderboards()
    loadPvpSetting()
  }, [])

  const handleSearchPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    setLoading(true)
    try {
      const playerData = await getPlayerByUsername(playerName)
      setPlayer(playerData)
    } catch (error) {
      console.error("Error fetching player:", error)
      setPlayer(null)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePvp = async () => {
    if (!player) return
    try {
      await updatePlayerPvpStatus(player.uuid, !player.pvp_enabled)
      setPlayer({ ...player, pvp_enabled: !player.pvp_enabled, verified: false })

      if (rollbackTimers.has(player.uuid)) {
        clearTimeout(rollbackTimers.get(player.uuid)!)
      }

      const timer = setTimeout(() => {
        checkAndRollbackIfUnverified(player.uuid)
        setRollbackTimers((prev) => {
          const newMap = new Map(prev)
          newMap.delete(player.uuid)
          return newMap
        })
      }, 60000)

      setRollbackTimers((prev) => new Map(prev).set(player.uuid, timer))
    } catch (error) {
      console.error("Error toggling PVP:", error)
    }
  }

  const loadLeaderboards = async () => {
    try {
      const response = await fetch("/api/leaderboards")
      const data = await response.json()
      setLeaderboards(data)
    } catch (error) {
      console.error("Error loading leaderboards:", error)
    }
  }

  const loadPvpSetting = async () => {
    try {
      const response = await fetch("/api/pvp-setting")
      const data = await response.json()
      setPvpForced(data.setting)
    } catch (error) {
      console.error("Error loading PVP setting:", error)
    }
  }

  if (!mounted) return null

  if (adminLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel
          onLogout={() => {
            setAdminLoggedIn(false)
            loadPvpSetting()
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⛏</div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">FrogCraft</h1>
          </div>

          <button
            onClick={() => setShowAdminButton(!showAdminButton)}
            className="opacity-0 hover:opacity-0 absolute pointer-events-none"
            title="Easter egg"
          />

          {showAdminButton && (
            <Button
              onClick={() => setAdminLoggedIn(true)}
              variant="outline"
              className="border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
            >
              Admin
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section className="animate-slide-up">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Willkommen bei <span className="gradient-text">FrogCraft</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Verwalte deinen PvP-Status und überblicke die Top-Spieler unseres Servers
            </p>
          </div>

          <div className="glass rounded-xl p-8 mb-12 border border-primary/20 hover:border-primary/50 transition-all duration-300 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Spieler-Profil</h3>
            <form onSubmit={handleSearchPlayer} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Gib deinen Minecraft-Namen ein..."
                className="flex-1 bg-input border-border/50 hover:border-border transition-colors text-foreground placeholder:text-foreground/50"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 transition-all duration-300 hover:scale-105"
              >
                {loading ? "Lädt..." : "Suchen"}
              </Button>
            </form>
          </div>

          {player && (
            <div className="animate-fade-in">
              <PlayerProfile player={player} onTogglePvp={handleTogglePvp} pvpForced={pvpForced} />
            </div>
          )}

          {player === null && playerName && !loading && (
            <div className="glass rounded-xl p-8 border border-destructive/30 text-center animate-fade-in">
              <p className="text-destructive">Spieler "{playerName}" nicht gefunden. Überprüfe die Schreibweise!</p>
            </div>
          )}
        </section>

        {leaderboards && (
          <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center gradient-text">Top Spieler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Leaderboard title="Bounty" players={leaderboards.bounty} type="bounty" />
              <Leaderboard title="Balance" players={leaderboards.balance} type="balance" />
              <Leaderboard title="Spielzeit" players={leaderboards.playtime} type="playtime" />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border/50 mt-20 py-8 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/50 text-sm">
          <p>FrogCraft PvP Server | Gib doppelt 'A' auf der Tastatur für Admin-Access</p>
        </div>
      </footer>
    </div>
  )
}
