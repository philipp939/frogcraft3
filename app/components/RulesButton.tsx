"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import Modal from "./Modal"

const rules = [
  "Keine unerlaubten Mods oder Hackclients",
  "Base griefen ist verboten",
  "Spieler töten und deren Stuff behalten ist erlaubt",
]

export default function RulesButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 w-full border border-gray-700"
        style={{ borderRadius: "0.5rem" }}
      >
        <Book className="mr-2 text-green-400" />
        Regeln
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Serverregeln">
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
