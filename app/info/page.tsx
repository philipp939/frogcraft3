import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function InfoPage() {
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

          <h1 className="text-3xl font-bold mb-8 text-yellow-300">Server Information</h1>

          <div className="space-y-6 text-gray-300">
            <p className="text-lg">Um auf den Server joinen zu können, musst du folgende Schritte befolgen:</p>
            <ol className="list-decimal list-inside space-y-4 ml-4">
              <li className="text-lg">
                Trete unserem{" "}
                <a
                  href="https://discord.gg/H2yX7d8Bmv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300"
                >
                  Discord-Server
                </a>{" "}
                bei.
              </li>
              <li className="text-lg">Gehe in den #whitelist-Channel.</li>
              <li className="text-lg">
                Verlinke deinen Discord-Account mit deinem Minecraft-Account, indem du den Befehl{" "}
                <code className="bg-gray-700/70 px-2 py-1 rounded-lg border border-gray-600/30">/link</code> verwendest.
              </li>
              <li className="text-lg">
                Wähle im Discord im Channel #pvp aus ob du mit oder ohne PVP spielen möchtest.
                <p className="mt-3 font-bold text-yellow-300">
                  Achtung: Du riskierst damit deinen Stuff zu verlieren wenn du getötet wirst!
                </p>
              </li>
            </ol>
            <div className="mt-8 p-6 bg-gray-700/40 rounded-xl border border-gray-600/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Empfehlung:</h3>
              <p className="text-lg">Spiele mit dem Voice-Chat Mod für ein besseres Spielerlebnis.</p>
              <ul className="list-disc list-inside mt-4 space-y-3 ml-4">
                <li className="text-lg">
                  Lade den{" "}
                  <a
                    href="https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300"
                  >
                    Simple Voice Chat Mod
                  </a>{" "}
                  herunter.
                </li>
                <li className="text-lg">
                  Oder nutze einfach unser{" "}
                  <a
                    href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300"
                  >
                    vorgefertigtes Modpack
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
