"use client"

import { useState, useEffect } from "react"
import { Loader2, Ban, Clock, AlertTriangle, Check, RefreshCw } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

interface BanRecord {
  id: number
  uuid: string
  username: string
  reason: string
  banned_by: string
  timestamp: string
  duration_minutes: number
  source: string
  active: boolean
}

export default function BanList() {
  const [bans, setBans] = useState<BanRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  const loadBans = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase.from("bans").select("*").order("timestamp", { ascending: false })

      if (error) {
        console.error("Fehler beim Laden der Banns:", error)
        throw error
      }

      setBans(data || [])
    } catch (err) {
      console.error("Fehler:", err)
      setError("Fehler beim Laden der Bann-Liste")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBans()
  }, [supabase])

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unbekannt"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes === 0) return "Permanent"
    if (minutes < 60) return `${minutes} Minuten`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} Stunden`
    return `${Math.floor(minutes / 1440)} Tage`
  }

  // Check if ban is expired
  const isBanExpired = (timestamp: string, durationMinutes: number) => {
    if (durationMinutes === 0) return false // Permanent bans never expire
    const banDate = new Date(timestamp)
    const expiryDate = new Date(banDate.getTime() + durationMinutes * 60 * 1000)
    return new Date() > expiryDate
  }

  // Toggle ban status
  const toggleBanStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("bans").update({ active: !currentStatus }).eq("id", id)

      if (error) {
        console.error("Fehler beim Aktualisieren des Bann-Status:", error)
        throw error
      }

      // Refresh the ban list
      loadBans()
    } catch (err) {
      console.error("Fehler:", err)
      setError("Fehler beim Aktualisieren des Bann-Status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center text-red-300">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <p>{error}</p>
      </div>
    )
  }

  if (bans.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <p className="text-gray-400">Keine Banns gefunden.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Gebannte Spieler</h3>
        <button
          onClick={loadBans}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Aktualisieren"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700/50">
              <th className="text-left py-3 px-4 font-medium">Spieler</th>
              <th className="text-left py-3 px-4 font-medium">Grund</th>
              <th className="text-left py-3 px-4 font-medium">Gebannt von</th>
              <th className="text-left py-3 px-4 font-medium">Datum</th>
              <th className="text-left py-3 px-4 font-medium">Dauer</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {bans.map((ban) => {
              const expired = isBanExpired(ban.timestamp, ban.duration_minutes)
              return (
                <tr key={ban.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                  <td className="py-3 px-4">{ban.username}</td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate" title={ban.reason}>
                      {ban.reason}
                    </div>
                  </td>
                  <td className="py-3 px-4">{ban.banned_by}</td>
                  <td className="py-3 px-4">{formatDate(ban.timestamp)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-blue-400" />
                      {formatDuration(ban.duration_minutes)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {ban.active ? (
                      expired ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-900/50 text-orange-300">
                          <Clock className="w-3 h-3 mr-1" />
                          Abgelaufen
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-900/50 text-red-300">
                          <Ban className="w-3 h-3 mr-1" />
                          Aktiv
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-300">
                        <Check className="w-3 h-3 mr-1" />
                        Inaktiv
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleBanStatus(ban.id, ban.active)}
                      className={`px-3 py-1 rounded-md text-xs ${
                        ban.active
                          ? "bg-green-900/30 hover:bg-green-800/50 text-green-300"
                          : "bg-red-900/30 hover:bg-red-800/50 text-red-300"
                      }`}
                    >
                      {ban.active ? "Aufheben" : "Aktivieren"}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
