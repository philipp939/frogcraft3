"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import Modal from "./Modal"

export default function InfoButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 w-full hover:scale-105 hover:shadow-lg text-base border border-yellow-400 backdrop-blur-sm bg-opacity-80"
      >
        <Info className="mr-2" />
        Server Info
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Server Information">
        <div className="space-y-4 text-gray-300">
          <p>Um auf den Server joinen zu können, musst du folgende Schritte befolgen:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Trete unserem{" "}
              <a
                href="https://discord.gg/H2yX7d8Bmv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Discord-Server
              </a>{" "}
              bei.
            </li>
            <li>Gehe in den #whitelist-Channel.</li>
            <li>
              Verlinke deinen Discord-Account mit deinem Minecraft-Account, indem du den Befehl{" "}
              <code className="bg-gray-700 px-1 rounded">/link</code> verwendest.
            </li>
            <li>
              Wähle im Discord im Channel #pvp aus ob du mit oder ohne PVP spielen möchtest.
              <p className="mt-2 font-bold text-yellow-300">
                Achtung: Du riskierst damit deinen Stuff zu verlieren wenn du getötet wirst!
              </p>
            </li>
          </ol>
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Empfehlung:</h3>
            <p>Spiele mit dem Voice-Chat Mod für ein besseres Spielerlebnis.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Lade den{" "}
                <a
                  href="https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
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
                  className="text-blue-400 hover:underline"
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
