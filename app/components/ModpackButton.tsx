import { Package } from "lucide-react"

export default function ModpackButton() {
  return (
    <a
      href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 w-full hover:scale-105 hover:shadow-lg text-base border border-orange-400 backdrop-blur-sm bg-opacity-80"
    >
      <Package className="mr-2" />
      Modpack Herunterladen
    </a>
  )
}

