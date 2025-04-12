"use client"

import { useState } from "react"
import { Keyboard } from "lucide-react"
import { motion } from "framer-motion"
import Modal from "./Modal"

const keybinds = [
  {
    section: "Optik",
    binds: [
      { key: "K", action: "Shader an/aus" },
      { key: "Y", action: "Fullbright an/aus" },
      { key: "C", action: "Zoom" },
    ],
  },
  {
    section: "Voice Chat",
    binds: [
      { key: "G", action: "Gruppen" },
      { key: "V", action: "Menü" },
    ],
  },
  {
    section: "Map",
    binds: [
      { key: "B", action: "Waypoint erstellen" },
      { key: "M", action: "Map öffnen" },
    ],
  },
]

export default function KeybindsButton() {
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
        <div className="bg-blue-900/30 p-4 rounded-full mb-4">
          <Keyboard className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-200 mb-2">Keybinds</h3>
        <p className="text-gray-500 text-sm">Tastenbelegungen</p>
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Keybinds">
        <p className="text-gray-400 mb-6 italic">
          Die Keybinds können in den Einstellungen personalisiert werden. (Funktioniert nur mit installiertem Modpack)
        </p>

        {keybinds.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8 last:mb-0">
            <h3 className="text-xl font-medium text-blue-400 mb-4">{section.section}</h3>
            <div className="grid gap-3">
              {section.binds.map((bind, bindIndex) => (
                <div key={bindIndex} className="flex items-center">
                  <code className="bg-gray-800 px-3 py-1.5 rounded-lg text-blue-400 font-mono mr-4 min-w-[36px] text-center border border-gray-700">
                    {bind.key}
                  </code>
                  <span className="text-gray-300">{bind.action}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Modal>
    </>
  )
}
