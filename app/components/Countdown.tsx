"use client"

import { useState, useEffect } from "react"

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Target date: July 21, 2024 at 19:00
    const targetDate = new Date("2024-07-21T19:00:00")

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        // Countdown finished
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mb-4 text-center">
      <h2 className="text-lg font-medium mb-2 text-gray-200">Server Start:</h2>
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-2 min-w-[60px]">
            <span className="text-2xl font-bold text-blue-400">{timeLeft.days}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">Tage</span>
        </div>
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-2 min-w-[60px]">
            <span className="text-2xl font-bold text-blue-400">{timeLeft.hours}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">Stunden</span>
        </div>
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-2 min-w-[60px]">
            <span className="text-2xl font-bold text-blue-400">{timeLeft.minutes}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">Minuten</span>
        </div>
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-2 min-w-[60px]">
            <span className="text-2xl font-bold text-blue-400">{timeLeft.seconds}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">Sekunden</span>
        </div>
      </div>
    </div>
  )
}
