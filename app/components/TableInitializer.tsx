"use client"

import { useEffect, useState } from "react"

export default function TableInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initTables = async () => {
      try {
        // Initialisiere alle Tabellen mit einem einzigen Aufruf
        const response = await fetch("/api/initialize-tables")

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Fehler beim Initialisieren der Tabellen:", errorData.error || response.statusText)
          return
        }

        console.log("Tabellen erfolgreich initialisiert")
        setInitialized(true)
      } catch (error) {
        console.error("Fehler bei der Tabelleninitialisierung:", error)
      }
    }

    initTables()
  }, [])

  return null // Diese Komponente rendert nichts
}
