import { Package } from "lucide-react"

export default function ModpackButton() {
  return (
    <a
      href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 min-w-[200px] hover:scale-105 hover:shadow-lg"
    >
      <Package className="mr-2" />
      Modpack
    </a>
  )
}

