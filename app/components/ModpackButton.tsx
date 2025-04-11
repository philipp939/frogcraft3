import { Package } from "lucide-react"

export default function ModpackButton() {
  return (
    <a
      href="https://www.curseforge.com/minecraft/modpacks/frogcraft1"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 w-full border border-gray-700"
      style={{ borderRadius: "0.5rem" }}
    >
      <Package className="mr-2 text-orange-400" />
      Modpack
    </a>
  )
}
