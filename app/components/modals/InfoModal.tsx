"use client"

import Modal from "./Modal"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Server Information">
      <div className="space-y-4">
        <p>Um auf den Server joinen zu können, musst du folgende Schritte befolgen:</p>

        <ol className="list-decimal list-inside space-y-3 ml-4">
          <li>
            Trete unserem{" "}
            <a
              href="https://discord.gg/H2yX7d8Bmv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Discord-Server
            </a>{" "}
            bei.
          </li>
          <li>Gehe in den #whitelist-Channel.</li>
          <li>
            Verlinke deinen Discord-Account mit deinem Minecraft-Account, indem du den Befehl{" "}
            <code className="px-2 py-1 rounded-md bg-gray-700 text-gray-300">/link</code> verwendest.
          </li>
          <li>
            Wähle im Discord im Channel #pvp aus ob du mit oder ohne PVP spielen möchtest.
            <p className="mt-2 text-yellow-400">
              Achtung: Du riskierst damit deinen Stuff zu verlieren wenn du getötet wirst!
            </p>
          </li>
        </ol>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Empfehlung:</h3>
          <p>Spiele mit dem Voice-Chat Mod für ein besseres Spielerlebnis.</p>
          <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
            <li>
              Lade den{" "}
              <a
                href="https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
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
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                vorgefertigtes Modpack
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}
