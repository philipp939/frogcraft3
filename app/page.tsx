"use client"

import type React from "react"

import { useState, useEffect } from "react"
import ProfessionalBackground from "./components/ProfessionalBackground"
import ModeratorLogin from "./components/ModeratorLogin"
import CopyableIP from "./components/CopyableIP"
import MinimalistButtonGrid from "./components/MinimalistButtonGrid"
import PlayerDashboard from "./components/PlayerDashboard"
import { createClientSupabaseClient } from "@/lib/supabase"
import MinimalistLeaderboard from "./components/MinimalistLeaderboard"

interface PlayerStat {
  uuid: string
  username: string
  playtime_minutes: number
  kills: number
  deaths: number
}

export default function Home() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showModLogin, setShowModLogin] = useState(false)
  const [savedUsername, setSavedUsername] = useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<PlayerStat[]>([])
  const supabase = createClientSupabaseClient()

  // Check for saved username in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("minecraft_username")
    if (saved) {
      setSavedUsername(saved)
      setUsername(saved)
    }

    // Lade Leaderboard-Daten
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("uuid, username, playtime_minutes, kills, deaths")
        .order("playtime_minutes", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Fehler beim Laden des Leaderboards:", error)
        return
      }

      setLeaderboardData(data || [])
    } catch (err) {
      console.error("Fehler beim Laden des Leaderboards:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) return

    setIsLoading(true)

    try {
      localStorage.setItem("minecraft_username", username)
      setSavedUsername(username)
      setShowDashboard(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative">
      <ProfessionalBackground />

      <main className="flex-grow flex flex-col items-center justify-center z-10 py-8 px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">FrogCraft</h1>
          <CopyableIP />

          <div className="mt-8 mb-8">
            <MinimalistLeaderboard initialData={leaderboardData} />
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700 p-6 mb-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  placeholder="Dein Minecraft-Name"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={!username || isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Einstellungen öffnen
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center z-10">
        <MinimalistButtonGrid />
        <div className="mt-4">
          <button
            onClick={() => setShowModLogin(true)}
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
          >
            Moderator-Login
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-4">© {new Date().getFullYear()} FrogCraft Minecraft Server</p>
      </footer>

      {showDashboard && <PlayerDashboard username={username} onClose={() => setShowDashboard(false)} />}
      {showModLogin && <ModeratorLogin onClose={() => setShowModLogin(false)} />}
    </div>
  )
}
