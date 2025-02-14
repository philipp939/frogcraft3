import Countdown from "@/components/Countdown"
import Rules from "@/components/Rules"
import Commands from "@/components/Commands"
import Keybinds from "@/components/Keybinds"
import ModpackButton from "@/components/ModpackButton"
import AnimatedBackground from "@/components/AnimatedBackground"
import DiscordButton from "@/components/DiscordButton"
import CopyableIP from "@/components/CopyableIP"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
      <AnimatedBackground />
      <div className="z-10 container mx-auto px-4 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-5xl font-bold mb-4 text-center">Willkommen auf FrogCraft</h1>
        <CopyableIP />
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-2xl font-semibold mb-4">Server Start in:</h2>
          <Countdown targetDate="2025-02-21T20:00:00" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            <ModpackButton />
            <DiscordButton />
            <Commands />
            <Keybinds />
            <Rules />
          </div>
        </div>
      </div>
    </main>
  )
}

