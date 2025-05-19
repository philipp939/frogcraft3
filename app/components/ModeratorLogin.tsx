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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-gray-800 rounded-3xl border border-gray-700 p-6 w-full max-w-sm shadow-xl"
        style={{ borderRadius: "24px" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Moderator-Login</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="Passwort eingeben"
              disabled={isLoading}
              style={{ borderRadius: "9999px" }}
            />
          </div>

          {error && (
            <div
              className="p-3 bg-red-900/30 border border-red-800 rounded-xl text-center"
              style={{ borderRadius: "12px" }}
            >
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: "9999px" }}
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
