"use client"

import { useState } from "react"
import { Info, Book, Terminal, Keyboard, MessageSquare, Package } from "lucide-react"
import InfoModal from "./modals/InfoModal"
import RulesModal from "./modals/RulesModal"
import CommandsModal from "./modals/CommandsModal"
import KeybindsModal from "./modals/KeybindsModal"

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <footer className="w-full py-6 mt-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <button
            onClick={() => openModal("info")}
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Info className="w-4 h-4 mr-2" />
            <span className="text-sm">Info</span>
          </button>

          <button
            onClick={() => openModal("rules")}
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Book className="w-4 h-4 mr-2" />
            <span className="text-sm">Regeln</span>
          </button>

          <button
            onClick={() => openModal("commands")}
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Terminal className="w-4 h-4 mr-2" />
            <span className="text-sm">Commands</span>
          </button>

          <button
            onClick={() => openModal("keybinds")}
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            <span className="text-sm">Keybinds</span>
          </button>

          <a
            href="https://discord.gg/H2yX7d8Bmv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="text-sm">Discord</span>
          </a>

          <a
            href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            <span className="text-sm">Modpack</span>
          </a>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Minecraft Server. Alle Rechte vorbehalten.</p>
        </div>
      </div>

      <InfoModal isOpen={activeModal === "info"} onClose={closeModal} />
      <RulesModal isOpen={activeModal === "rules"} onClose={closeModal} />
      <CommandsModal isOpen={activeModal === "commands"} onClose={closeModal} />
      <KeybindsModal isOpen={activeModal === "keybinds"} onClose={closeModal} />
    </footer>
  )
}
