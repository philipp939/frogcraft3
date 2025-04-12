import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const rules = [
  "Keine unerlaubten Mods oder Hackclients",
  "Base griefen ist verboten",
  "Spieler töten und deren Stuff behalten ist erlaubt",
]

export default function RulesPage() {
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

          <h1 className="text-3xl font-bold mb-8 text-blue-300">Serverregeln</h1>

          <ul className="list-disc list-inside space-y-4 text-gray-300 ml-4">
            {rules.map((rule, index) => (
              <li key={index} className="text-lg">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
