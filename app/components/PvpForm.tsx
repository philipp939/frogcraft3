"use client"

import type React from "react"

import { useState } from "react"

export default function PvpForm() {
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setStatus("error")
      setMessage("Bitte gib deinen Minecraft-Namen ein.")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/pvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "PVP wurde erfolgreich für deinen Account aktiviert!")
        setUsername("")
      } else {
        setStatus("error")
        setMessage(data.error || "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.")
    }
  }

  return (
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
          disabled={status === "loading"}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Wird aktiviert..." : "PVP aktivieren"}
      </button>

      {status === "success" && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg">
          <p className="text-green-300 text-sm">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-300 text-sm">{message}</p>
        </div>
      )}
    </form>
  )
}
