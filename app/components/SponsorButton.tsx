"use client"

import { Heart } from "lucide-react"

export default function SponsorButton() {
  const handleClick = () => {
    window.open("https://discord.gg/Y2hyNvuHUm", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
    >
      <Heart className="mr-2 h-4 w-4" />
      Sponsor
    </button>
  )
}
