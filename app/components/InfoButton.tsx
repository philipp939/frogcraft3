"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { motion } from "framer-motion"
import Modal from "./Modal"

export default function InfoButton() {
  const [isOpen, setIsOpen] = useState(false)

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 text-center h-full bg-gray-900 border-gray-800 shadow-md shadow-black/50 hover:shadow-lg hover:shadow-black/60"
        variants={item}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="p-4 rounded-full mb-4 bg-yellow-900/30">
          <Info className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-medium mb-2 text-gray-200">Server Info</h3>
        <p className="text-gray-500 text-sm">Wichtige Informationen</p>
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Server Information">
        <div className="space-y-6 text-gray-300">
          <p>Um auf den Server joinen zu können, musst du folgende Schritte befolgen:</p>

          <ol className="space-y-4 list-decimal list-inside ml-4">
            <li>
              Trete unserem{" "}
              <a
                href="https://discord.gg/H2yX7d8Bmv"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Discord-Server
              </a>{" "}
              bei.
            </li>
            <li>Gehe in den #whitelist-Channel.</li>
            <li>
              Verlinke deinen Discord-Account mit deinem Minecraft-Account, indem du den Befehl{" "}
              <code className="px-2 py-1 rounded-md font-mono bg-gray-800 text-gray-300">/link</code> verwendest.
            </li>
            <li>
              Wähle im Discord im Channel #pvp aus ob du mit oder ohne PVP spielen möchtest.
              <p className="mt-2 font-medium text-yellow-400">
                Achtung: Du riskierst damit deinen Stuff zu verlieren wenn du getötet wirst!
              </p>
            </li>
          </ol>

          <div className="mt-8 p-6 rounded-xl border bg-gray-800 border-gray-700">
            <h3 className="text-lg font-medium mb-3 text-gray-100">Empfehlung:</h3>
            <p>Spiele mit dem Voice-Chat Mod für ein besseres Spielerlebnis.</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>
                Lade den{" "}
                <a
                  href="https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Simple Voice Chat Mod
                </a>{" "}
                herunter.
              </li>
              <li>
                Oder nutze einfach unser{" "}
                <a
                  href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  vorgefertigtes Modpack
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  )
}
