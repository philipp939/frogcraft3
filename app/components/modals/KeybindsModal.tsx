"use client"

import { X } from "lucide-react"

interface KeybindsModalProps {
  isOpen: boolean
  onClose: () => void
}

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

export default function KeybindsModal({ isOpen, onClose }: KeybindsModalProps) {
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
          <h2 className="text-xl font-semibold text-white">Keybinds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-400 mb-4 italic">
          Die Keybinds können in den Einstellungen personalisiert werden. (Funktioniert nur mit installiertem Modpack)
        </p>

        {keybinds.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6 last:mb-0">
            <h3 className="text-lg font-medium text-blue-400 mb-3">{section.section}</h3>
            <div className="grid gap-2">
              {section.binds.map((bind, bindIndex) => (
                <div key={bindIndex} className="flex items-center">
                  <code className="bg-gray-700 px-3 py-1 rounded-md text-blue-400 font-mono mr-3 min-w-[32px] text-center">
                    {bind.key}
                  </code>
                  <span className="text-gray-300">{bind.action}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
