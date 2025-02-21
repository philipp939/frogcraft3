import { Heart } from "lucide-react"

export default function SponsorButton() {
  return (
    <a
      href="https://discord.gg/qjFtsYV46K"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm border border-pink-400 backdrop-blur-sm bg-opacity-80"
    >
      <Heart className="mr-2 w-4 h-4" />
      Sponsor
    </a>
  )
}

