"use client"

import { useState, useEffect } from "react"

interface CountdownProps {
  targetDate: string
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    Tage: 0,
    Stunden: 0,
    Minuten: 0,
    Sekunden: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          Tage: Math.floor(difference / (1000 * 60 * 60 * 24)),
          Stunden: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          Minuten: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          Sekunden: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex justify-center items-center gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="bg-blue-500 bg-opacity-50 rounded-lg p-4 backdrop-blur-sm w-24 h-24 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{value.toString().padStart(2, "0")}</span>
          </div>
          <div className="text-sm mt-2 text-white">{unit}</div>
        </div>
      ))}
    </div>
  )
}

