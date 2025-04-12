"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { motion } from "framer-motion"

interface CopyableIPProps {
  theme: "light" | "dark" | "original"
}

export default function CopyableIP({ theme }: CopyableIPProps) {
  const [copied, setCopied] = useState(false)
  const ip = "frog-craft.de"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (theme === "original") {
    return (
      <div className="mb-8 text-center">
        <motion.div
          className="inline-flex items-center bg-blue-800/50 backdrop-blur-sm px-6 py-4 rounded-lg border border-blue-700/50 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg font-medium mr-4 text-blue-100">Zukünftige Server IP:</span>
          <code className="bg-blue-900/70 px-4 py-2 rounded-md text-blue-200 font-mono border border-blue-800/70">
            {ip}
          </code>
          <button
            onClick={copyToClipboard}
            className="ml-4 p-2 rounded-full hover:bg-blue-700/50 transition-all duration-300"
            aria-label="IP-Adresse kopieren"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-blue-300" />}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mb-8 text-center">
      <motion.div
        className={`inline-flex items-center px-6 py-4 rounded-full border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800 shadow-md shadow-black/50 hover:shadow-lg hover:shadow-black/60"
            : "bg-white border-gray-200 shadow-sm hover:shadow-md"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`text-lg font-medium mr-4 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
          Zukünftige Server IP:
        </span>
        <code
          className={`px-4 py-2 rounded-full font-mono border ${
            theme === "dark" ? "bg-gray-800 text-blue-400 border-gray-700" : "bg-gray-50 text-gray-800 border-gray-200"
          }`}
        >
          {ip}
        </code>
        <button
          onClick={copyToClipboard}
          className={`ml-4 p-2 rounded-full transition-all duration-300 ${
            theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
          aria-label="IP-Adresse kopieren"
        >
          {copied ? (
            <Check className={`w-5 h-5 ${theme === "dark" ? "text-green-500" : "text-green-500"}`} />
          ) : (
            <Copy className={`w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
          )}
        </button>
      </motion.div>
    </div>
  )
}
