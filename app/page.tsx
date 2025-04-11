import ProfessionalBackground from "./components/ProfessionalBackground"
import CopyableIP from "./components/CopyableIP"
import ButtonGrid from "./components/ButtonGrid"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white px-4 py-8">
      <ProfessionalBackground />
      <div className="z-10 container mx-auto flex flex-col items-center justify-center space-y-8 max-w-4xl">
        <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg border border-gray-700 shadow-xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">FrogCraft</span>
          </h1>

          <div className="bg-red-900 bg-opacity-80 p-4 rounded-lg text-white text-center mb-6 border border-red-800">
            <p className="text-xl font-semibold">Derzeit ist kein Server aktiv</p>
            <p className="mt-2">Ein neuer Server wird in ein paar Monaten verfügbar sein.</p>
          </div>

          <CopyableIP />

          <div className="bg-blue-900 bg-opacity-80 p-5 rounded-lg text-white text-center mb-8 border border-blue-800">
            <p className="text-lg font-semibold mb-2">Für Informationen zu zukünftigen Servern:</p>
            <p className="text-base">
              Tritt unserem{" "}
              <a
                href="https://discord.gg/H2yX7d8Bmv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline font-semibold"
              >
                Discord
              </a>{" "}
              bei! Dort erhältst du alle Neuigkeiten und Updates zu kommenden Servern.
            </p>
          </div>

          <ButtonGrid />
        </div>
      </div>
    </main>
  )
}
