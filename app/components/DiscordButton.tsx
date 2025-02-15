import { FaDiscord } from "react-icons/fa"

export default function DiscordButton() {
  return (
    <a
      href="https://discord.gg/H2yX7d8Bmv"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 w-full hover:scale-105 hover:shadow-lg text-sm sm:text-base md:text-lg border border-blue-400 backdrop-blur-sm bg-opacity-80"
    >
      <FaDiscord className="mr-2 text-xl sm:text-2xl" />
      Discord Beitreten
    </a>
  )
}

