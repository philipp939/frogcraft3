import FuturisticBackground from "./components/FuturisticBackground"
import CopyableIP from "./components/CopyableIP"
import Countdown from "./components/Countdown"
import ButtonGrid from "./components/ButtonGrid"
import Impressum from "./components/Impressum"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white px-4 py-8">
      <FuturisticBackground />
      <div className="z-10 container mx-auto flex flex-col items-center justify-center space-y-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">Willkommen auf FrogCraft</h1>
        <CopyableIP />
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Server Start in:</h2>
          <Countdown targetDate="2025-02-21T20:00:00" />
          <ButtonGrid />
        </div>
        <div className="mt-8">
          <Impressum />
        </div>
      </div>
    </main>
  )
}

