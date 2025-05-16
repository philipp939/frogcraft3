"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

export default function WhitelistForm() {
  const [username, setUsername] = useState("")
  const [discordTag, setDiscordTag] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !discordTag) {
      setStatus("error")
      setMessage("Bitte fülle alle Felder aus.")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, discordTag }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Du wurdest erfolgreich zur Whitelist hinzugefügt!")
        setUsername("")
        setDiscordTag("")
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
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Server Whitelist</h2>

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
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dein Minecraft-Name"
              disabled={status === "loading"}
            />
          </div>

          <div>
            <label htmlFor="discordTag" className="block text-sm font-medium text-gray-300 mb-1">
              Discord-Tag
            </label>
            <input
              type="text"
              id="discordTag"
              value={discordTag}
              onChange={(e) => setDiscordTag(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dein Discord-Tag (z.B. username#1234)"
              disabled={status === "loading"}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Wird bearbeitet...
              </>
            ) : (
              "Zur Whitelist hinzufügen"
            )}
          </button>
        </form>

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg flex items-start"
          >
            <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-green-300 text-sm">{message}</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg"
          >
            <p className="text-red-300 text-sm">{message}</p>
          </motion.div>
        )}

        <p className="mt-6 text-xs text-gray-500 text-center">
          Nach der Anmeldung wird dein Benutzername überprüft und zur Whitelist hinzugefügt.
          <br />
          Du erhältst eine Bestätigung in unserem Discord-Server.
        </p>
      </motion.div>
    </div>
  )
}
