"use client"

import { useState, useEffect } from "react"
import { Trophy, Clock, Swords, ArrowUpDown } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"

interface PlayerStat {
  uuid: string
  username: string
  joined_at: string
  last_seen: string
  playtime_minutes: number
  pvp_enable: boolean
  deaths: number
  kills: number
}

type SortField = "playtime" | "kills" | "kd"

export default function Leaderboard() {
  const [players, setPlayers] = useState<PlayerStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortField>("playtime")
  const supabase = createServerSupabaseClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)

        // Alle Spieler aus der Haupttabelle laden
        const { data, error } = await supabase
          .from("players")
          .select("*")
          .order("playtime_minutes", { ascending: false })
          .limit(10)

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

    fetchLeaderboard()
  }, [supabase])

  // Format playtime (minutes to hours and minutes)
  const formatPlaytime = (minutes: number) => {
    if (!minutes) return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Calculate K/D ratio
  const calculateKD = (kills: number, deaths: number) => {
    if (deaths === 0) return kills > 0 ? Number.POSITIVE_INFINITY : 0
    return kills / deaths
  }

  // Sort players based on selected field
  const sortedPlayers = [...players].sort((a, b) => {
    switch (sortBy) {
      case "playtime":
        return b.playtime_minutes - a.playtime_minutes
      case "kills":
        return b.kills - a.kills
      case "kd":
        return calculateKD(b.kills, b.deaths) - calculateKD(a.kills, a.deaths)
      default:
        return 0
    }
  })

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-400 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Leaderboard
        </h3>

        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy("playtime")}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
              sortBy === "playtime" ? "bg-blue-900/50 text-blue-300" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Clock className="w-3 h-3 mr-1" />
            Spielzeit
          </button>
          <button
            onClick={() => setSortBy("kills")}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
              sortBy === "kills" ? "bg-green-900/50 text-green-300" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Swords className="w-3 h-3 mr-1" />
            Kills
          </button>
          <button
            onClick={() => setSortBy("kd")}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
              sortBy === "kd" ? "bg-purple-900/50 text-purple-300" : "bg-gray-700 text-gray-300"
            }`}
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            K/D
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      ) : players.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Noch keine Spielerdaten verfügbar</p>
      ) : (
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.uuid}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600/50"
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    index === 0
                      ? "bg-yellow-500/20 text-yellow-300"
                      : index === 1
                        ? "bg-gray-400/20 text-gray-300"
                        : index === 2
                          ? "bg-amber-600/20 text-amber-400"
                          : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="font-medium">{player.username}</span>
              </div>

              <div className="flex items-center space-x-4">
                {sortBy === "playtime" && (
                  <div className="flex items-center text-blue-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatPlaytime(player.playtime_minutes)}</span>
                  </div>
                )}

                {sortBy === "kills" && (
                  <div className="flex items-center text-green-400">
                    <Swords className="w-4 h-4 mr-1" />
                    <span>{player.kills}</span>
                  </div>
                )}

                {sortBy === "kd" && (
                  <div className="flex items-center text-purple-400">
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    <span>
                      {calculateKD(player.kills, player.deaths) === Number.POSITIVE_INFINITY
                        ? "∞"
                        : calculateKD(player.kills, player.deaths).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
