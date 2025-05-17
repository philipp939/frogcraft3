"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PlayerSearch() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setError("Bitte gib deinen Minecraft-Namen ein.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Spieler suchen oder erstellen
      const response = await fetch(`/api/player?username=${encodeURIComponent(username)}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ein Fehler ist aufgetreten")
      }

      // Zur Spieler-Seite weiterleiten
      router.push(`/player/${encodeURIComponent(username.toLowerCase())}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
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
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dein Minecraft-Name"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Wird geladen..." : "Einstellungen anzeigen"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </form>
    </div>
  )
}
