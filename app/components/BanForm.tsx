"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, X, Check, AlertTriangle } from "lucide-react"

interface BanFormProps {
  onClose: () => void
  onSuccess?: () => void
  initialUsername?: string
}

export default function BanForm({ onClose, onSuccess, initialUsername = "" }: BanFormProps) {
  const [username, setUsername] = useState(initialUsername)
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState<number | "">("")
  const [bannedBy, setBannedBy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !reason || duration === "" || !bannedBy) {
      setError("Bitte fülle alle Felder aus.")
      return
    }

    setIsLoading(true)
    setError(null)
    setDetailedError(null)

    try {
      const response = await fetch("/api/bans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          reason,
          duration_minutes: Number(duration),
          banned_by: bannedBy,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Fehler-Response:", data)
        throw new Error(data.error || "Fehler beim Erstellen des Banns")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (err) {
      console.error("Fehler beim Bannen:", err)
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")

      // Versuche, detaillierte Fehlerinformationen zu extrahieren
      if (err instanceof Error && err.message.includes("details")) {
        try {
          const details = JSON.parse(err.message.split("details:")[1])
          setDetailedError(JSON.stringify(details, null, 2))
        } catch (parseErr) {
          setDetailedError("Konnte detaillierte Fehlerinformationen nicht parsen")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Spieler bannen</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Schließen">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 flex items-center text-green-300">
            <Check className="w-5 h-5 mr-2" />
            <p>Spieler wurde erfolgreich gebannt!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Spielername
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Spielername"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
                Grund
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                placeholder="Grund für den Bann"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                Dauer (Minuten, 0 = permanent)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Dauer in Minuten (0 = permanent)"
                disabled={isLoading}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDuration(60)} // 1 Stunde
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md"
                >
                  1 Stunde
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(1440)} // 1 Tag
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md"
                >
                  1 Tag
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(10080)} // 1 Woche
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md"
                >
                  1 Woche
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(43200)} // 30 Tage
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-md"
                >
                  30 Tage
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(0)} // Permanent
                  className="px-2 py-1 bg-red-900/50 hover:bg-red-800 text-xs rounded-md"
                >
                  Permanent
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="bannedBy" className="block text-sm font-medium text-gray-300 mb-1">
                Gebannt von
              </label>
              <input
                type="text"
                id="bannedBy"
                value={bannedBy}
                onChange={(e) => setBannedBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Dein Name oder ID"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 mt-1">
                Hinweis: Du musst kein registrierter Spieler sein, um jemanden zu bannen.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-red-300" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>

                {detailedError && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-300 cursor-pointer">Technische Details anzeigen</summary>
                    <pre className="mt-2 p-2 bg-red-950/30 rounded text-xs text-red-300 overflow-x-auto">
                      {detailedError}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isLoading}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Spieler bannen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
