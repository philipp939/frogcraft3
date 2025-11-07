"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "kahba") {
      setIsLoggedIn(true)
      setError("")
    } else {
      setError("Falsches Passwort")
      setPassword("")
    }
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <header className="sticky top-0 z-40 border-b border-border/50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Admin Panel</h1>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
            >
              Zurück
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AdminPanel
            onLogout={() => {
              setIsLoggedIn(false)
              router.push("/")
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="glass rounded-xl p-8 max-w-md w-full mx-4 border border-primary/20">
        <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Admin Passwort</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben..."
              className="bg-input border-border/50 text-foreground placeholder:text-foreground/50"
              autoFocus
            />
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105"
          >
            Login
          </Button>
        </form>
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="w-full mt-4 text-foreground/70 hover:text-foreground"
        >
          Zurück zur Startseite
        </Button>
      </div>
    </div>
  )
}
