import "./globals.css"
import "./border-radius-fix.css" // Neue CSS-Datei für runde Ecken
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import TableInitializer from "./components/TableInitializer"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FrogCraft Minecraft Server",
  description: "Minecraft Server mit PVP-Option und Voice-Chat",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        {/* Meta-Tag für bessere Darstellung auf mobilen Geräten */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Meta-Tag für Kompatibilität mit älteren Browsern */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Zusätzliches Style-Tag für abgerundete Ecken */}
        <style>
          {`
            .rounded-full { border-radius: 9999px !important; }
            .rounded-3xl { border-radius: 24px !important; }
            .rounded-2xl { border-radius: 16px !important; }
            .rounded-xl { border-radius: 12px !important; }
            button, input, div { border-radius: inherit; }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <TableInitializer />
        {children}
      </body>
    </html>
  )
}
