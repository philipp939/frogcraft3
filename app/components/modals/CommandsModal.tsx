"use client"

import Modal from "./Modal"

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Server Commands">
      <div className="space-y-3">
        {commands.map((cmd, index) => (
          <div key={index} className="bg-gray-700 p-3 rounded-lg">
            <code className="text-purple-400 font-mono text-sm block mb-1">{cmd.command}</code>
            <p className="text-gray-300 text-sm">{cmd.description}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}
