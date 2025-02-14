import { FaDiscord } from "react-icons/fa"

export default function DiscordButton() {
  return (
    <a
      href="https://discord.gg/H2yX7d8Bmv"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 min-w-[200px] hover:scale-105 hover:shadow-lg"
    >
      <FaDiscord className="mr-2 text-2xl" />
      Discord
    </a>
  )
}

