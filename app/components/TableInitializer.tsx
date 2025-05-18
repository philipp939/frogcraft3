"use client"

import { useEffect, useState } from "react"

export default function TableInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initTables = async () => {
      try {
        const response = await fetch("/api/create-tables")
        if (response.ok) {
          console.log("Tabellen erfolgreich initialisiert")
          setInitialized(true)
        } else {
          console.error("Fehler beim Initialisieren der Tabellen")
        }
      } catch (error) {
        console.error("Fehler:", error)
      }
    }

    initTables()
  }, [])

  return null // Diese Komponente rendert nichts
}
