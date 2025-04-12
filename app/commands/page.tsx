import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

export default function CommandsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white px-4 py-12 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <div className="z-10 container mx-auto flex flex-col items-center justify-center space-y-8 max-w-4xl">
        <div className="bg-gray-900/60 backdrop-blur-md p-10 rounded-2xl border border-gray-800/50 shadow-2xl w-full">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Zurück zur Startseite
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-purple-300">Server Commands</h1>

          <div className="grid gap-4">
            {commands.map((cmd, index) => (
              <div key={index} className="bg-gray-700/50 p-5 rounded-xl border border-gray-600/30">
                <code className="text-green-400 font-mono text-lg">{cmd.command}</code>
                <p className="text-gray-300 mt-2 text-lg">{cmd.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
