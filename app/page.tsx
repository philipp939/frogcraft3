import FuturisticBackground from "./components/FuturisticBackground"
import CopyableIP from "./components/CopyableIP"
import Countdown from "./components/Countdown"
import ButtonGrid from "./components/ButtonGrid"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
      <FuturisticBackground />
      <div className="z-10 container mx-auto px-4 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-5xl font-bold mb-4 text-center">Willkommen auf FrogCraft</h1>
        <CopyableIP />
        <div className="flex flex-col items-center justify-center w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Server Start in:</h2>
          <Countdown targetDate="2025-02-21T20:00:00" />
          <ButtonGrid />
        </div>
      </div>
    </main>
  )
}

