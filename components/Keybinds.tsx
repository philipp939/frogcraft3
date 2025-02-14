"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard } from "lucide-react"

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
    section: "Mods",
    binds: [{ key: "F", action: "Cart anschließen" }],
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

export default function Keybinds() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 min-w-[200px] hover:scale-105 hover:shadow-lg"
      >
        <Keyboard className="mr-2" />
        Keybinds
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
              <h2 className="text-2xl font-bold mb-4">Keybinds</h2>
              <p className="text-gray-300 mb-4 italic">
                Die Keybinds können in den Einstellungen personalisiert werden. (Funktioniert nur mit installiertem
                Modpack)
              </p>
              {keybinds.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6 last:mb-0">
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">{section.section}</h3>
                  <div className="grid gap-2">
                    {section.binds.map((bind, bindIndex) => (
                      <motion.div
                        key={bindIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: bindIndex * 0.1 }}
                        className="flex items-center"
                      >
                        <code className="bg-gray-700 px-2 py-1 rounded text-green-400 font-mono mr-3 min-w-[30px] text-center">
                          {bind.key}
                        </code>
                        <span className="text-gray-300">{bind.action}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
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

