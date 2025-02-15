"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Book } from "lucide-react"

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

export default function Rules() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 min-w-[200px] hover:scale-105 hover:shadow-lg"
      >
        <Book className="mr-2" />
        Regeln
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Serverregeln</h2>
              <ul className="list-disc list-inside space-y-2">
                {rules.map((rule, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-300"
                  >
                    {rule}
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

