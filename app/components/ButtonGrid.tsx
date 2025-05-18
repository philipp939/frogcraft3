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

  return (
    <div className="flex flex-wrap justify-center gap-6 text-base">
      <button
        onClick={() => openModal("info")}
        className="text-gray-300 hover:text-white transition-colors flex items-center"
      >
        <Info className="w-4 h-4 mr-2" />
        <span>Info</span>
      </button>

      <button
        onClick={() => openModal("rules")}
        className="text-gray-300 hover:text-white transition-colors flex items-center"
      >
        <Book className="w-4 h-4 mr-2" />
        <span>Regeln</span>
      </button>

      <button
        onClick={() => openModal("commands")}
        className="text-gray-300 hover:text-white transition-colors flex items-center"
      >
        <Terminal className="w-4 h-4 mr-2" />
        <span>Commands</span>
      </button>

      <button
        onClick={() => openModal("keybinds")}
        className="text-gray-300 hover:text-white transition-colors flex items-center"
      >
        <Keyboard className="w-4 h-4 mr-2" />
        <span>Keybinds</span>
      </button>

      <a
        href="https://discord.gg/H2yX7d8Bmv"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors flex items-center"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        <span>Discord</span>
      </a>

      <a
        href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors flex items-center"
      >
        <Package className="w-4 h-4 mr-2" />
        <span>Modpack</span>
      </a>

      {/* Modals */}
      <InfoModal isOpen={activeModal === "info"} onClose={closeModal} />
      <RulesModal isOpen={activeModal === "rules"} onClose={closeModal} />
      <CommandsModal isOpen={activeModal === "commands"} onClose={closeModal} />
      <KeybindsModal isOpen={activeModal === "keybinds"} onClose={closeModal} />
    </div>
  )
}
