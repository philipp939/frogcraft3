// app/components/PvpForm.tsx
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

  // Rest des Codes bleibt gleich...
}