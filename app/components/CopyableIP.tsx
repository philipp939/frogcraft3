"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { motion } from "framer-motion"

export default function CopyableIP() {
  const [copied, setCopied] = useState(false)
  const ip = "frog-craft.de"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mb-8 text-center">
      <motion.div
        className="inline-flex items-center px-6 py-4 rounded-full border transition-all duration-300 bg-gray-900 border-gray-800 shadow-md shadow-black/50 hover:shadow-lg hover:shadow-black/60"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg font-medium mr-4 text-gray-300">Zukünftige Server IP:</span>
        <code className="px-4 py-2 rounded-full font-mono border bg-gray-800 text-blue-400 border-gray-700">{ip}</code>
        <button
          onClick={copyToClipboard}
          className="ml-4 p-2 rounded-full transition-all duration-300 hover:bg-gray-800"
          aria-label="IP-Adresse kopieren"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
        </button>
      </motion.div>
    </div>
  )
}
