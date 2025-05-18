"use client"

import { X } from "lucide-react"

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

const rules = [
  "Keine unerlaubten Mods oder Hackclients",
  "Base griefen ist verboten",
  "Spieler töten und deren Stuff behalten ist erlaubt",
]

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
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
          <h2 className="text-xl font-semibold text-white">Serverregeln</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-3">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-flex items-center justify-center bg-green-900/30 text-green-400 rounded-full w-6 h-6 text-sm mr-3 flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-300">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
