"use client"

import type { PvpPlayer } from "@/lib/types"

interface LeaderboardProps {
  title: string
  players: PvpPlayer[]
  type: "bounty" | "balance" | "playtime"
}

export function Leaderboard({ title, players, type }: LeaderboardProps) {
  const getValue = (player: PvpPlayer) => {
    switch (type) {
      case "bounty":
        return `$${player.bounty.toLocaleString()}`
      case "balance":
        return `$${player.balance.toLocaleString()}`
      case "playtime":
        return `${Math.floor(player.playtime_minutes / 60)}h`
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 cursor-pointer">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={player.uuid} className="flex items-center justify-between bg-background rounded p-3">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold text-lg w-6">#{index + 1}</span>
              <span className="font-semibold">{player.username}</span>
            </div>
            <span className="text-accent font-bold">{getValue(player)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
