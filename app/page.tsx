import FuturisticBackground from "./components/FuturisticBackground"
import CopyableIP from "./components/CopyableIP"
import ButtonGrid from "./components/ButtonGrid"
import SponsorButton from "./components/SponsorButton"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white px-4 py-8">
      <FuturisticBackground />
      <div className="z-10 container mx-auto flex flex-col items-center justify-center space-y-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">Willkommen auf FrogCraft</h1>

        {/* Add server status message */}
        <div className="bg-red-500 bg-opacity-70 p-4 rounded-lg text-white text-center mb-4 max-w-2xl">
          <p className="text-xl font-semibold">Derzeit ist kein Server aktiv.</p>
          <p className="mt-2">Ein neuer Server wird in ein paar Monaten verfügbar sein. Bleibt dran!</p>
        </div>

        <CopyableIP />
        <div className="flex flex-col items-center justify-center w-full">
          <div className="bg-blue-600 bg-opacity-70 p-6 rounded-lg text-white text-center mb-8 max-w-2xl">
            <p className="text-xl font-semibold mb-2">Für Informationen zu zukünftigen Servern:</p>
            <p className="text-lg">
              Tritt unserem{" "}
              <a
                href="https://discord.gg/H2yX7d8Bmv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:underline font-semibold"
              >
                Discord
              </a>{" "}
              bei! Dort erhältst du alle Neuigkeiten und Updates zu kommenden Servern.
            </p>
          </div>
          <ButtonGrid />
        </div>
        <div className="mt-8">
          <SponsorButton />
        </div>
      </div>
    </main>
  )
}
