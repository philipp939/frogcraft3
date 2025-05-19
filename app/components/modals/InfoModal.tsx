"use client"
import { X } from "lucide-react"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-3xl border border-gray-700 p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: "24px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Server Information</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
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

          <div className="mt-6 p-4 bg-gray-700 rounded-2xl" style={{ borderRadius: "16px" }}>
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
      </div>
    </div>
  )
}
