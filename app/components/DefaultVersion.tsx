"use client"

import { useState } from "react"
import { Copy, Check, Info, Book, Terminal, Keyboard, Package } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import ProfessionalBackground from "./ProfessionalBackground"
import Modal from "./Modal"

export default function DefaultVersion() {
  const [copied, setCopied] = useState(false)
  const ip = "frog-craft.de"
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  // Modal content
  const rules = [
    "Keine unerlaubten Mods oder Hackclients",
    "Base griefen ist verboten",
    "Spieler töten und deren Stuff behalten ist erlaubt",
  ]

  const commands = [
    {
      command: "/spawn",
      description: "Teleportiert dich zum Server-Spawn",
    },
    {
      command: "/tpa <spieler>",
      description: "Sendet eine Teleport-Anfrage an einen Spieler",
    },
    {
      command: "/home",
      description: "Teleportiert dich zu deinem gesetzten Zuhause",
    },
    {
      command: "/sethome",
      description: "Setzt dein Zuhause an deiner aktuellen Position",
    },
    {
      command: "/balance",
      description: "Zeigt dein aktuelles Guthaben",
    },
  ]

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white p-4">
      <ProfessionalBackground />

      <div className="max-w-4xl w-full bg-gray-900/60 backdrop-blur-md p-8 rounded-lg border border-gray-800/50">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-blue-400">FrogCraft</h1>

        {/* Server Status */}
        <div className="bg-red-900/80 p-4 rounded-md mb-6 text-center">
          <p className="font-medium text-white">Derzeit ist kein Server aktiv</p>
          <p className="text-gray-200">Ein neuer Server wird in ein paar Monaten verfügbar sein.</p>
        </div>

        {/* IP Address */}
        <div className="flex items-center justify-center bg-gray-800/80 p-4 rounded-md mb-8">
          <span className="mr-2 text-gray-300">Zukünftige Server IP:</span>
          <code className="bg-gray-900 px-3 py-1 rounded-md text-blue-400 font-mono">{ip}</code>
          <button
            onClick={copyToClipboard}
            className="ml-3 p-1.5 rounded-md hover:bg-gray-700 transition-colors"
            aria-label="IP-Adresse kopieren"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        {/* Discord Info */}
        <div className="bg-blue-900/80 p-4 rounded-md mb-8 text-center">
          <p className="font-medium mb-1">Für Informationen zu zukünftigen Servern:</p>
          <p>
            Tritt unserem{" "}
            <a
              href="https://discord.gg/H2yX7d8Bmv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              Discord
            </a>{" "}
            bei! Dort erhältst du alle Neuigkeiten und Updates zu kommenden Servern.
          </p>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Server Info Button */}
          <button
            onClick={() => openModal("info")}
            className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 p-4 rounded-lg transition-colors"
          >
            <div className="mr-3 text-yellow-500 bg-yellow-900/30 p-2 rounded-lg">
              <Info className="w-5 h-5" />
            </div>
            <span>Server Info</span>
          </button>

          {/* Rules Button */}
          <button
            onClick={() => openModal("rules")}
            className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 p-4 rounded-lg transition-colors"
          >
            <div className="mr-3 text-green-500 bg-green-900/30 p-2 rounded-lg">
              <Book className="w-5 h-5" />
            </div>
            <span>Regeln</span>
          </button>

          {/* Commands Button */}
          <button
            onClick={() => openModal("commands")}
            className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 p-4 rounded-lg transition-colors"
          >
            <div className="mr-3 text-purple-500 bg-purple-900/30 p-2 rounded-lg">
              <Terminal className="w-5 h-5" />
            </div>
            <span>Commands</span>
          </button>

          {/* Keybinds Button */}
          <button
            onClick={() => openModal("keybinds")}
            className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 p-4 rounded-lg transition-colors"
          >
            <div className="mr-3 text-blue-500 bg-blue-900/30 p-2 rounded-lg">
              <Keyboard className="w-5 h-5" />
            </div>
            <span>Keybinds</span>
          </button>

          {/* Discord Button */}
          <a
            href="https://discord.gg/H2yX7d8Bmv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 p-4 rounded-lg transition-colors"
          >
            <div className="mr-3 text-white bg-white/10 p-2 rounded-lg">
              <FaDiscord className="w-5 h-5" />
            </div>
            <span>Discord</span>
          </a>

          {/* Modpack Button */}
          <a
            href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 p-4 rounded-lg transition-colors"
          >
            <div className="mr-3 text-orange-500 bg-orange-900/30 p-2 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <span>Modpack</span>
          </a>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === "info"} onClose={closeModal} title="Server Information">
        <div className="space-y-6 text-gray-300">
          <p>Um auf den Server joinen zu können, musst du folgende Schritte befolgen:</p>

          <ol className="space-y-4 list-decimal list-inside ml-4">
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
              <code className="bg-gray-800 px-2 py-1 rounded-md text-gray-300">/link</code> verwendest.
            </li>
            <li>
              Wähle im Discord im Channel #pvp aus ob du mit oder ohne PVP spielen möchtest.
              <p className="mt-2 font-medium text-yellow-400">
                Achtung: Du riskierst damit deinen Stuff zu verlieren wenn du getötet wirst!
              </p>
            </li>
          </ol>

          <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="text-lg font-medium mb-3 text-gray-100">Empfehlung:</h3>
            <p>Spiele mit dem Voice-Chat Mod für ein besseres Spielerlebnis.</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
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

      <Modal isOpen={activeModal === "rules"} onClose={closeModal} title="Serverregeln">
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

      <Modal isOpen={activeModal === "commands"} onClose={closeModal} title="Server Commands">
        <div className="space-y-4">
          {commands.map((cmd, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-xl border border-gray-600">
              <code className="text-purple-400 font-mono text-base block mb-2">{cmd.command}</code>
              <p className="text-gray-300">{cmd.description}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === "keybinds"} onClose={closeModal} title="Keybinds">
        <p className="text-gray-400 mb-6 italic">
          Die Keybinds können in den Einstellungen personalisiert werden. (Funktioniert nur mit installiertem Modpack)
        </p>

        {keybinds.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8 last:mb-0">
            <h3 className="text-xl font-medium text-blue-400 mb-4">{section.section}</h3>
            <div className="grid gap-3">
              {section.binds.map((bind, bindIndex) => (
                <div key={bindIndex} className="flex items-center">
                  <code className="bg-gray-700 px-3 py-1.5 rounded-lg text-blue-400 font-mono mr-4 min-w-[36px] text-center border border-gray-600">
                    {bind.key}
                  </code>
                  <span className="text-gray-300">{bind.action}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Modal>
    </main>
  )
}
