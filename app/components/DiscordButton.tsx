"use client"

import { FaDiscord } from "react-icons/fa"
import { motion } from "framer-motion"

export default function DiscordButton() {
  const handleClick = () => {
    window.open("https://discord.gg/H2yX7d8Bmv", "_blank")
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
      <div className="bg-[#5865F2]/20 p-4 rounded-full mb-4">
        <FaDiscord className="w-8 h-8 text-[#5865F2]" />
      </div>
      <h3 className="text-xl font-medium text-gray-200 mb-2">Discord</h3>
      <p className="text-gray-500 text-sm">Tritt unserer Community bei</p>
    </motion.button>
  )
}
