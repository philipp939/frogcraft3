"use client"

import { ThemeProvider, useTheme } from "./context/theme-context"
import DefaultVersion from "./components/DefaultVersion"
import BetaVersion from "./components/BetaVersion"
import ThemeSwitcher from "./components/ThemeSwitcher"

function HomePage() {
  const { theme } = useTheme()

  return (
    <>
      {theme === "default" ? <DefaultVersion /> : <BetaVersion />}
      <ThemeSwitcher />
    </>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  )
}
