import "./globals.css"
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
  title: "Minecraft Server Countdown",
  description: "Countdown zum Server-Start und PVP-Aktivierung",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body className={inter.className}>
        <TableInitializer />
        {children}
      </body>
    </html>
  )
}
