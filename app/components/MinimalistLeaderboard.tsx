"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"

interface PlayerStat {
  uuid: string
  username: string
  playtime_minutes: number
  kills: number
  deaths: number
}

interface MinimalistLeaderboardProps {
  initialData?: PlayerStat[]
}

export default function MinimalistLeaderboard({ initialData = [] }: MinimalistLeaderboardProps) {
  const [players, setPlayers] = useState<PlayerStat[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    if (initialData.length === 0) {
      loadLeaderboard()
    }
  }, [initialData])

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("players")
        .select("uuid, username, playtime_minutes")
        .order("playtime_minutes", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Fehler beim Laden des Leaderboards:", error)
        throw error
      }

      setPlayers(data || [])
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Format playtime (minutes to hours and minutes)
  const formatPlaytime = (minutes: number) => {
    if (!minutes) return "0h"
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2 text-blue-400">Top Spieler</h3>
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-700 rounded-full w-3/4 mx-auto"></div>
          ))}
        </div>
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2 text-blue-400">Top Spieler</h3>
        <p className="text-gray-400 text-sm">Noch keine Spielerdaten verfügbar</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium mb-3 text-blue-400">Top Spieler</h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={player.uuid} className="flex items-center justify-center space-x-2">
            <span className="text-gray-400 text-sm">{index + 1}.</span>
            <span className="text-white">{player.username}</span>
            <span className="text-gray-400 text-sm">({formatPlaytime(player.playtime_minutes)})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
