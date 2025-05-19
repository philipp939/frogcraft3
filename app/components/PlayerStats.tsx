"use client"

import { useState, useEffect } from "react"
import { Clock, Skull, Swords, Calendar } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

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

export default function PlayerStats({ username }: { username?: string }) {
  const [stats, setStats] = useState<PlayerStat | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!username) return

      try {
        setIsLoading(true)
        setError(null)

        // Direkt aus der Haupttabelle abfragen, da alle Daten dort sind
        const { data, error } = await supabase
          .from("players")
          .select("*")
          .eq("username", username.toLowerCase())
          .single()

        if (error) {
          console.error("Fehler beim Laden der Spielerdaten:", error)
          throw error
        }

        setStats(data)
      } catch (err) {
        console.error("Error fetching player stats:", err)
        setError("Fehler beim Laden der Spielerstatistiken")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayerStats()
  }, [username, supabase])

  // Format playtime (minutes to hours and minutes)
  const formatPlaytime = (minutes: number) => {
    if (!minutes) return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Nie"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Calculate K/D ratio
  const calculateKD = (kills: number, deaths: number) => {
    if (deaths === 0) return kills > 0 ? "∞" : "0"
    return (kills / deaths).toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4 w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
        <p className="text-red-400">
          {error || "Keine Statistiken gefunden. Spiele auf dem Server, um Statistiken zu sammeln!"}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
      <h3 className="text-xl font-bold mb-4 text-blue-400">Deine Statistiken</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-900/30 p-2 rounded-full">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Spielzeit</p>
            <p className="font-medium">{formatPlaytime(stats.playtime_minutes)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-red-900/30 p-2 rounded-full">
            <Skull className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Tode</p>
            <p className="font-medium">{stats.deaths}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-green-900/30 p-2 rounded-full">
            <Swords className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Kills</p>
            <p className="font-medium">
              {stats.kills} (K/D: {calculateKD(stats.kills, stats.deaths)})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-purple-900/30 p-2 rounded-full">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Zuletzt online</p>
            <p className="font-medium">{formatDate(stats.last_seen)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
