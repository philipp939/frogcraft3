"use client"

import { useState } from "react"
import type { PvpPlayer } from "@/lib/types"

interface PlayerProfileProps {
  player: PvpPlayer | null
  onTogglePvp: () => Promise<void>
  pvpForced: "enabled" | "disabled" | "neutral"
}

export function PlayerProfile({ player, onTogglePvp, pvpForced }: PlayerProfileProps) {
  const [loading, setLoading] = useState(false)
  const [showVerifyMessage, setShowVerifyMessage] = useState(false)

  const handleTogglePvp = async () => {
    if (!player || pvpForced !== "neutral") return
    setLoading(true)
    try {
      await onTogglePvp()
      setShowVerifyMessage(true)
      setTimeout(() => setShowVerifyMessage(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  if (!player) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Spieler nicht gefunden</p>
      </div>
    )
  }

  const isPvpDisabled = pvpForced !== "neutral"

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{player.username}</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background rounded p-4">
            <div className="text-sm text-muted-foreground">Kills</div>
            <div className="text-2xl font-bold text-primary">{player.kills}</div>
          </div>
          <div className="bg-background rounded p-4">
            <div className="text-sm text-muted-foreground">Deaths</div>
            <div className="text-2xl font-bold text-destructive">{player.deaths}</div>
          </div>
          <div className="bg-background rounded p-4">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold text-accent">${player.balance.toLocaleString()}</div>
          </div>
          <div className="bg-background rounded p-4">
            <div className="text-sm text-muted-foreground">Bounty</div>
            <div className="text-2xl font-bold text-secondary">${player.bounty.toLocaleString()}</div>
          </div>
          <div className="bg-background rounded p-4">
            <div className="text-sm text-muted-foreground">Playtime</div>
            <div className="text-2xl font-bold">{Math.floor(player.playtime_minutes / 60)}h</div>
          </div>
          <div className="bg-background rounded p-4">
            <div className="text-sm text-muted-foreground">PVP Status</div>
            <div className={`text-2xl font-bold ${player.pvp_enabled ? "text-primary" : "text-muted-foreground"}`}>
              {player.pvp_enabled ? "An" : "Aus"}
            </div>
          </div>
        </div>

        {showVerifyMessage && (
          <div className="bg-accent/10 border border-accent rounded p-4 mb-4 text-sm animate-fade-in">
            <p className="text-accent font-semibold">Änderung eingeleitet!</p>
            <p className="text-accent/80">
              Gib bitte <code className="bg-background px-2 py-1 rounded inline-block mt-1">/verify</code> im Game ein,
              um die Änderung zu übernehmen.
            </p>
          </div>
        )}

        {isPvpDisabled && (
          <div
            className={`border rounded p-4 mb-4 text-sm ${
              pvpForced === "enabled"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-destructive/10 border-destructive text-destructive"
            }`}
          >
            <p className="font-semibold">
              {pvpForced === "enabled" ? "PVP ist für alle aktiviert!" : "PVP ist für alle deaktiviert!"}
            </p>
            <p className="text-xs opacity-80">Du kannst deinen PVP-Status momentan nicht ändern.</p>
          </div>
        )}

        <button
          onClick={handleTogglePvp}
          disabled={loading || isPvpDisabled}
          className={`w-full py-2 px-4 rounded font-semibold transition-all ${
            isPvpDisabled
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              : player.pvp_enabled
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {loading ? "Lädt..." : player.pvp_enabled ? "PVP Aus" : "PVP An"}
        </button>
      </div>
    </div>
  )
}
