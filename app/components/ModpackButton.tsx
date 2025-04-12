"use client"

import { Package } from "lucide-react"
import { motion } from "framer-motion"

export default function ModpackButton() {
  const handleClick = () => {
    window.open("https://www.curseforge.com/minecraft/modpacks/frogcraft1", "_blank")
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.button
      onClick={handleClick}
      className="flex flex-col items-center justify-center bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-md shadow-black/50 hover:shadow-lg hover:shadow-black/60 transition-all duration-300 text-center h-full"
      variants={item}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="bg-orange-900/30 p-4 rounded-full mb-4">
        <Package className="w-8 h-8 text-orange-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-200 mb-2">Modpack</h3>
      <p className="text-gray-500 text-sm">Lade unser Modpack herunter</p>
    </motion.button>
  )
}
