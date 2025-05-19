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
    // Target date: This Friday at 20:00 (German time)
    const today = new Date()
    const targetDay = new Date(today)
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 7 - dayOfWeek + 5

    targetDay.setDate(today.getDate() + daysUntilFriday)
    targetDay.setHours(20, 0, 0, 0) // 20:00:00.000

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDay.getTime() - now.getTime()

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
    <div className="mb-6 text-center">
      <h2 className="text-xl font-bold mb-3 text-blue-400">Server Start:</h2>
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-3 min-w-[70px]">
            <span className="text-3xl font-bold text-blue-400">{timeLeft.days}</span>
          </div>
          <span className="text-sm text-gray-400 mt-1">Tage</span>
        </div>
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-3 min-w-[70px]">
            <span className="text-3xl font-bold text-blue-400">{timeLeft.hours}</span>
          </div>
          <span className="text-sm text-gray-400 mt-1">Stunden</span>
        </div>
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-3 min-w-[70px]">
            <span className="text-3xl font-bold text-blue-400">{timeLeft.minutes}</span>
          </div>
          <span className="text-sm text-gray-400 mt-1">Minuten</span>
        </div>
        <div className="text-center">
          <div className="bg-gray-800 rounded-lg p-3 min-w-[70px]">
            <span className="text-3xl font-bold text-blue-400">{timeLeft.seconds}</span>
          </div>
          <span className="text-sm text-gray-400 mt-1">Sekunden</span>
        </div>
      </div>
    </div>
  )
}
