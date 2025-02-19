"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

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
    <button
      onClick={copyToClipboard}
      className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-white hover:text-gray-200 transition-colors duration-300 flex items-center gap-2 flex-wrap justify-center"
    >
      <span>Server IP: {ip}</span>
      {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
    </button>
  )
}

