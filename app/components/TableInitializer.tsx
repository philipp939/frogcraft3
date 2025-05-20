"use client"

import { useEffect, useState } from "react"

export default function TableInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initTables = async () => {
      try {
        const response = await fetch("/api/initialize-tables")
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || response.statusText)
          return
        }

        setInitialized(true)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred during initialization")
      }
    }

    initTables()
  }, [])

  if (error) {
    console.error("Table initialization error:", error)
  }

  return null
}