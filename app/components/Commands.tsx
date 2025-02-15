"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal } from "lucide-react"

const commands = [
  {
    command: "/spawn",
    description: "Teleportiert dich zum Server-Spawn",
  },
  {
    command: "/tpa <spieler>",
    description: "Sendet eine Teleport-Anfrage an einen Spieler",
  },
  {
    command: "/home",
    description: "Teleportiert dich zu deinem gesetzten Zuhause",
  },
  {
    command: "/sethome",
    description: "Setzt dein Zuhause an deiner aktuellen Position",
  },
  {
    command: "/msg <spieler> <nachricht>",
    description: "Sendet eine private Nachricht an einen Spieler",
  },
  {
    command: "/rtp",
    description: "Teleportiert dich an einen zufälligen Ort",
  },
  {
    command: "/kit starter",
    description: "Gibt dir das Starter-Kit (alle 24h verfügbar)",
  },
  {
    command: "/shop",
    description: "Öffnet den Server-Shop",
  },
  {
    command: "/baltop",
    description: "Zeigt die reichsten Spieler",
  },
  {
    command: "/help",
    description: "Zeigt alle verfügbaren Befehle",
  },
]

export default function Commands() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 min-w-[200px] hover:scale-105 hover:shadow-lg"
      >
        <Terminal className="mr-2" />
        Commands
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Server Commands</h2>
              <div className="grid gap-3">
                {commands.map((cmd, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700 bg-opacity-50 p-3 rounded-lg"
                  >
                    <code className="text-green-400 font-mono">{cmd.command}</code>
                    <p className="text-gray-300 mt-1">{cmd.description}</p>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

