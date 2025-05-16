"use client"

import Modal from "./Modal"

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Serverregeln">
      <ul className="space-y-3">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-flex items-center justify-center bg-green-900/30 text-green-400 rounded-full w-6 h-6 text-sm mr-3 flex-shrink-0 mt-0.5">
              {index + 1}
            </span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
