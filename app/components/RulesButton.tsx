"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import Modal from "./Modal"

const rules = [
  "Respektiere alle Spieler",
  "Kein Griefing oder Stehlen",
  "Keine Cheats oder Hacks",
  "Halte den Chat familienfreundlich",
  "Melde Bugs an die Admins",
  "Baue nicht zu nah an anderen Spielern ohne Erlaubnis",
  "Nutze die vorgesehenen Bereiche für PvP",
  "Folge den Anweisungen der Moderatoren",
  "Keine Werbung für andere Server",
  "Hab Spaß und sei kreativ!",
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
        <ul className="list-disc list-inside space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="text-gray-300">
              {rule}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}

