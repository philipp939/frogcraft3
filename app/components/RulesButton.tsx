"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import { motion } from "framer-motion"
import Modal from "./Modal"

const rules = [
  "Keine unerlaubten Mods oder Hackclients",
  "Base griefen ist verboten",
  "Spieler töten und deren Stuff behalten ist erlaubt",
]

export default function RulesButton() {
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
        <div className="bg-green-900/30 p-4 rounded-full mb-4">
          <Book className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-200 mb-2">Regeln</h3>
        <p className="text-gray-500 text-sm">Erfahre die Serverregeln</p>
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Serverregeln">
        <ul className="space-y-4 text-gray-300">
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
    </>
  )
}
