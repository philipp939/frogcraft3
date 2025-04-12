"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "default" | "beta"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default")

  useEffect(() => {
    // Beim ersten Laden die gespeicherte Präferenz abrufen
    const savedTheme = localStorage.getItem("frogcraft-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "default" ? "beta" : "default"
    setTheme(newTheme)
    localStorage.setItem("frogcraft-theme", newTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
