"use client"

import { useState } from "react"
import { Terminal } from "lucide-react"
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
]

export default function CommandsButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 w-full hover:scale-105 hover:shadow-lg text-base border border-purple-400 backdrop-blur-sm bg-opacity-80"
      >
        <Terminal className="mr-2" />
        Commands
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Server Commands">
        <div className="grid gap-3">
          {commands.map((cmd, index) => (
            <div key={index} className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
              <code className="text-green-400 font-mono">{cmd.command}</code>
              <p className="text-gray-300 mt-1">{cmd.description}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

