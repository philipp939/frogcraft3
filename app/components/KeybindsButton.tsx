"use client"

import { useState } from "react"
import { Keyboard } from "lucide-react"
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 w-full border border-gray-700"
        style={{ borderRadius: "0.5rem" }}
      >
        <Keyboard className="mr-2 text-blue-400" />
        Keybinds
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Keybinds">
        <p className="text-gray-300 mb-4 italic">
          Die Keybinds können in den Einstellungen personalisiert werden. (Funktioniert nur mit installiertem Modpack)
        </p>
        {keybinds.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6 last:mb-0">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">{section.section}</h3>
            <div className="grid gap-2">
              {section.binds.map((bind, bindIndex) => (
                <div key={bindIndex} className="flex items-center">
                  <code className="bg-gray-700 px-2 py-1 rounded text-green-400 font-mono mr-3 min-w-[30px] text-center">
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
