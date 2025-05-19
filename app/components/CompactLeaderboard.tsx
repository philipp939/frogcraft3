"use client"

import { useState, useEffect } from "react"
import { Trophy, Clock, Swords, ArrowUpDown, RefreshCw } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

interface PlayerStat {
  uuid: string
  username: string
  playtime_minutes: number
  kills: number
  deaths: number
}

type SortField = "playtime" | "kills" | "kd"

interface CompactLeaderboardProps {
  initialData?: PlayerStat[]
}

export default function CompactLeaderboard({ initialData = [] }: CompactLeaderboardProps) {
  const [players, setPlayers] = useState<PlayerStat[]>(initialData)
  const [isLoading, setIsLoading] = useState(initialData.length === 0)
  const [sortBy, setSortBy] = useState<SortField>("playtime")
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
        .select("uuid, username, playtime_minutes, kills, deaths")
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Top Spieler</h3>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy("playtime")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
              sortBy === "playtime" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            Spielzeit
          </button>
          <button
            onClick={() => setSortBy("kills")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
              sortBy === "kills" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Swords className="w-4 h-4 mr-1" />
            Kills
          </button>
          <button
            onClick={() => setSortBy("kd")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
              sortBy === "kd" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            K/D
          </button>
          <button
            onClick={loadLeaderboard}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
            aria-label="Aktualisieren"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="bg-gray-700/50 rounded-2xl p-6 text-center">
          <p className="text-gray-400">Noch keine Spielerdaten verfügbar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.uuid}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index === 0
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
                      : index === 1
                        ? "bg-gray-400/20 text-gray-300 border border-gray-400/50"
                        : index === 2
                          ? "bg-amber-600/20 text-amber-400 border border-amber-600/50"
                          : "bg-gray-700 text-gray-400 border border-gray-600/50"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="font-medium text-lg">{player.username}</span>
              </div>

              <div className="flex items-center space-x-6">
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
