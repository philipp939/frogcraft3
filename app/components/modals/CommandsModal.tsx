"use client"

import { X } from "lucide-react"

interface CommandsModalProps {
  isOpen: boolean
  onClose: () => void
}

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

export default function CommandsModal({ isOpen, onClose }: CommandsModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Server Commands</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {commands.map((cmd, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-lg">
              <code className="text-purple-400 font-mono text-base block mb-1">{cmd.command}</code>
              <p className="text-gray-300">{cmd.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
