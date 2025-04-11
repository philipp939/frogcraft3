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
        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 w-full hover:scale-105 hover:shadow-lg text-base border border-green-400 backdrop-blur-sm bg-opacity-80"
      >
        <Book className="mr-2" />
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
