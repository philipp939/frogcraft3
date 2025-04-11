"use client"

import { FaDiscord } from "react-icons/fa"

export default function DiscordButton() {
  const handleClick = () => {
    window.open("https://discord.gg/H2yX7d8Bmv", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 w-full border border-[#4752C4]"
      style={{ borderRadius: "0.5rem" }}
    >
      <FaDiscord className="mr-2 text-xl" />
      Discord
    </button>
  )
}
