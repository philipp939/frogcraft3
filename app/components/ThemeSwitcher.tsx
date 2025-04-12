"use client"

import { motion } from "framer-motion"
import { useTheme } from "../context/theme-context"

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <button
        onClick={toggleTheme}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300
          ${
            theme === "beta"
              ? "bg-black text-white border border-gray-700 hover:bg-gray-900"
              : "bg-blue-900 text-white border border-blue-800 hover:bg-blue-800"
          }
        `}
      >
        <span className="font-medium">Beta</span>
        <div
          className={`
          w-10 h-5 rounded-full p-1 transition-colors duration-300
          ${theme === "beta" ? "bg-blue-600" : "bg-gray-300"}
        `}
        >
          <div
            className={`
            bg-white w-3 h-3 rounded-full transform transition-transform duration-300
            ${theme === "beta" ? "translate-x-5" : "translate-x-0"}
          `}
          />
        </div>
      </button>
    </motion.div>
  )
}
