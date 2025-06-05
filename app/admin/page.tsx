"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Crown, Gamepad2, Lock, Construction } from "lucide-react"
import Link from "next/link"

interface Player {
  id: number
  username: string
  joined_at: string
  last_seen: string
  playtime_minutes: number
  pvp_enabled: boolean
  verified: boolean
  deaths: number
  kills: number
  bounty: number
}

interface Ban {
  id: number
  player_id: number
  reason: string
  banned_by: string
  banned_at: string
  expires_at: string | null
  is_active: boolean
  ban_type: string
  player: { username: string }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [bans, setBans] = useState<Ban[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Ban form state
  const [banForm, setBanForm] = useState({
    username: "",
    reason: "",
    banType: "temporary",
    duration: "1",
    bannedBy: "Admin",
  })

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "kahba") {
      setIsAuthenticated(true)
      loadData()
    } else {
      setMessage({ type: "error", text: "Falsches Passwort!" })
    }
  }

  const loadData = async () => {
    try {
      const [playersRes, bansRes] = await Promise.all([fetch("/api/admin/players"), fetch("/api/admin/bans")])

      if (playersRes.ok) {
        const playersData = await playersRes.json()
        setPlayers(playersData.players || [])
      }

      if (bansRes.ok) {
        const bansData = await bansRes.json()
        setBans(bansData.bans || [])
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Laden der Daten" })
    } finally {
      setIsLoading(false)
    }
  }

  const createBan = async () => {
    if (!banForm.username || !banForm.reason) {
      setMessage({ type: "error", text: "Benutzername und Grund sind erforderlich" })
      return
    }

    try {
      const response = await fetch("/api/admin/bans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Fehler beim Erstellen des Bans")
      }

      setMessage({ type: "success", text: "Ban erfolgreich erstellt" })
      setBanForm({ username: "", reason: "", banType: "temporary", duration: "1", bannedBy: "Admin" })
      loadData()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Erstellen des Bans",
      })
    }
  }

  const removeBan = async (banId: number) => {
    try {
      const response = await fetch(`/api/admin/bans/${banId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Fehler beim Entfernen des Bans")
      }

      setMessage({ type: "success", text: "Ban erfolgreich entfernt" })
      loadData()
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Entfernen des Bans" })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE")
  }

  // Passwort-Eingabe anzeigen, wenn nicht authentifiziert
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center">
              <Lock className="h-6 w-6 mr-2" />
              Admin-Zugang
            </CardTitle>
            <CardDescription className="text-gray-400">Passwort eingeben um fortzufahren</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Passwort
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 border-white/20 text-white rounded-lg"
                  placeholder="Passwort eingeben..."
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg">
                Anmelden
              </Button>
            </form>
            {message && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                <p className="text-red-300 text-sm">{message.text}</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
                Zurück zur Startseite
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Admin-Panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-purple-300 rounded-lg">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setIsAuthenticated(false)}
                className="text-white hover:text-red-300 rounded-lg"
              >
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center">
                <Construction className="h-6 w-6 mr-2" />
                In Entwicklung
              </CardTitle>
              <CardDescription className="text-gray-400">Das Admin-Panel wird derzeit entwickelt</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">
                Die Admin-Funktionen sind noch nicht verfügbar. Diese werden in einer zukünftigen Version hinzugefügt.
              </p>
              <Link href="/">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg">Zurück zur Startseite</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
