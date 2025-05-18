"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import PlayerSettings from "./components/PlayerSettings"
import ProfessionalBackground from "./components/ProfessionalBackground"
import ModeratorLogin from "./components/ModeratorLogin"
import Countdown from "./components/Countdown"
import CopyableIP from "./components/CopyableIP"
import ButtonGrid from "./components/ButtonGrid"

export default function Home() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showModLogin, setShowModLogin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setError("Bitte gib deinen Minecraft-Namen ein.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Hier könnten wir prüfen, ob der Spieler existiert
      // Für jetzt gehen wir davon aus, dass jeder Spielername gültig ist
      setShowSettings(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative">
      <ProfessionalBackground />

      <main className="flex-grow flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-md mx-auto px-4">
          {/* Header-Bereich */}
          <div className="mb-4 text-center">
            <CopyableIP />
            <Countdown />
          </div>

          {/* Spieler-Einstellungen Bereich */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-5 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Minecraft-Benutzername
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Dein Minecraft-Name"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Wird geladen...
                  </>
                ) : (
                  "Einstellungen anzeigen"
                )}
              </button>

              {error && (
                <div className="p-2 bg-red-900/30 border border-red-800 rounded-md">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Server-Informationen */}
          <div className="mb-4">
            <ButtonGrid />
          </div>

          {/* Moderator-Login Link */}
          <div className="text-center mb-2">
            <button
              onClick={() => setShowModLogin(true)}
              className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
            >
              Moderator-Login
            </button>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center text-gray-500 z-10 text-sm">
        <p>© {new Date().getFullYear()} FrogCraft Minecraft Server</p>
      </footer>

      {showSettings && <PlayerSettings username={username} onClose={() => setShowSettings(false)} />}
      {showModLogin && <ModeratorLogin onClose={() => setShowModLogin(false)} />}
    </div>
  )
}
