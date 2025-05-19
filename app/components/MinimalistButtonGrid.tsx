"use client"

import { useState } from "react"
import InfoModal from "./modals/InfoModal"
import RulesModal from "./modals/RulesModal"
import CommandsModal from "./modals/CommandsModal"
import KeybindsModal from "./modals/KeybindsModal"

export default function MinimalistButtonGrid() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const links = [
    { label: "Info", action: () => openModal("info") },
    { label: "Regeln", action: () => openModal("rules") },
    { label: "Commands", action: () => openModal("commands") },
    { label: "Keybinds", action: () => openModal("keybinds") },
    {
      label: "Discord",
      action: () => window.open("https://discord.gg/H2yX7d8Bmv", "_blank"),
    },
    {
      label: "Modpack",
      action: () => window.open("https://www.curseforge.com/minecraft/modpacks/frogcraft1", "_blank"),
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
      {links.map((link, index) => (
        <button key={index} onClick={link.action} className="text-gray-300 hover:text-white transition-colors text-sm">
          {link.label}
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
