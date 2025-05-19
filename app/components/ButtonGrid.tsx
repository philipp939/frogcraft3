"use client"

import { useState } from "react"
import { Info, Book, Terminal, Keyboard, MessageSquare, Package } from "lucide-react"
import InfoModal from "./modals/InfoModal"
import RulesModal from "./modals/RulesModal"
import CommandsModal from "./modals/CommandsModal"
import KeybindsModal from "./modals/KeybindsModal"

export default function ButtonGrid() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const buttons = [
    { icon: <Info className="w-5 h-5" />, label: "Info", action: () => openModal("info") },
    { icon: <Book className="w-5 h-5" />, label: "Regeln", action: () => openModal("rules") },
    { icon: <Terminal className="w-5 h-5" />, label: "Commands", action: () => openModal("commands") },
    { icon: <Keyboard className="w-5 h-5" />, label: "Keybinds", action: () => openModal("keybinds") },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Discord",
      action: () => window.open("https://discord.gg/H2yX7d8Bmv", "_blank"),
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Modpack",
      action: () => window.open("https://www.curseforge.com/minecraft/modpacks/frogcraft1", "_blank"),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.action}
          className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 text-center bg-gray-700/70 border-gray-600/50 hover:bg-gray-700 hover:border-gray-500"
        >
          <div className="p-2 rounded-full mb-2 bg-gray-600/50">{button.icon}</div>
          <span className="text-sm font-medium">{button.label}</span>
        </button>
      ))}

      {/* Modals */}
      <InfoModal isOpen={activeModal === "info"} onClose={closeModal} />
      <RulesModal isOpen={activeModal === "rules"} onClose={closeModal} />
      <CommandsModal isOpen={activeModal === "commands"} onClose={closeModal} />
      <KeybindsModal isOpen={activeModal === "keybinds"} onClose={closeModal} />
    </div>
  )
}
