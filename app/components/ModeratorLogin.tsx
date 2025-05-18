"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ModeratorLoginProps {
  onClose: () => void
}

export default function ModeratorLogin({ onClose }: ModeratorLoginProps) {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      setError("Bitte gib das Passwort ein.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Hier würden wir normalerweise eine echte Authentifizierung durchführen
      // Für jetzt verwenden wir ein hartcodiertes Passwort
      if (password === "kahba") {
        // Erfolgreicher Login
        router.push("/admin")
      } else {
        setError("Falsches Passwort.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Moderator-Login</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Schließen">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Anmelden
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
