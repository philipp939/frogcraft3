"use client"

import { useState } from "react"
import { Terminal } from "lucide-react"
import { motion } from "framer-motion"
import Modal from "./Modal"

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
    command: "/balance",
    description: "Zeigt dein aktuelles Guthaben",
  },
]

export default function CommandsButton() {
  const [isOpen, setIsOpen] = useState(false)

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-md shadow-black/50 hover:shadow-lg hover:shadow-black/60 transition-all duration-300 text-center h-full"
        variants={item}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="bg-purple-900/30 p-4 rounded-full mb-4">
          <Terminal className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-200 mb-2">Commands</h3>
        <p className="text-gray-500 text-sm">Nützliche Server-Befehle</p>
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Server Commands">
        <div className="space-y-4">
          {commands.map((cmd, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <code className="text-purple-400 font-mono text-base block mb-2">{cmd.command}</code>
              <p className="text-gray-300">{cmd.description}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
