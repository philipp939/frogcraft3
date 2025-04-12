import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

export default function KeybindsPage() {
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

          <h1 className="text-3xl font-bold mb-8 text-blue-300">Keybinds</h1>

          <p className="text-gray-300 mb-8 text-lg italic">
            Die Keybinds können in den Einstellungen personalisiert werden. (Funktioniert nur mit installiertem Modpack)
          </p>

          {keybinds.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">{section.section}</h2>
              <div className="grid gap-4">
                {section.binds.map((bind, bindIndex) => (
                  <div key={bindIndex} className="flex items-center">
                    <code className="bg-gray-700/70 px-4 py-2 rounded-lg text-green-400 font-mono mr-5 min-w-[40px] text-center border border-gray-600/30 text-lg">
                      {bind.key}
                    </code>
                    <span className="text-gray-300 text-lg">{bind.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
