"use client"

import { useEffect, useState } from "react"

export default function TableInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initTables = async () => {
      try {
        // Erstelle die player_settings-Tabelle
        const response1 = await fetch("/api/create-tables")
        if (!response1.ok) {
          const errorData = await response1.json()
          console.error(
            "Fehler beim Initialisieren der player_settings-Tabelle:",
            errorData.error || response1.statusText,
          )
        }

        // Erstelle die bans-Tabelle
        const response2 = await fetch("/api/create-bans-table")
        if (!response2.ok) {
          const errorData = await response2.json()
          console.error("Fehler beim Initialisieren der bans-Tabelle:", errorData.error || response2.statusText)
        }

        if (response1.ok && response2.ok) {
          console.log("Tabellen erfolgreich initialisiert")
          setInitialized(true)
        }
      } catch (error) {
        console.error("Fehler bei der Tabelleninitialisierung:", error)
      }
    }

    initTables()
  }, [])

  return null // Diese Komponente rendert nichts
}
