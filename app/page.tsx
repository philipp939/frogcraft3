"use client"

import PvpForm from "./components/PvpForm"
import Countdown from "./components/Countdown"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Server Start</h1>

          <div className="mb-12">
            <Countdown targetDate="2025-05-23T20:00:00" />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">PVP aktivieren</h2>
            <p className="text-gray-400 mb-6">
              Aktiviere PVP für deinen Charakter auf dem Server. Achtung: Du riskierst damit deinen Stuff zu verlieren!
            </p>

            <PvpForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
