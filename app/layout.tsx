import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"

// Konfiguriere die Inter-Schriftart mit Next.js Font-System
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FrogCraft - Minecraft Server",
  description: "Willkommen auf dem FrogCraft Minecraft Server!",
  icons: {
    icon: "/images/frogcraft-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}


import './globals.css'