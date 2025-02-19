"use client"

import { useState } from "react"
import { Check, Copy, Server } from "lucide-react"

export default function CopyableIP() {
  const [copied, setCopied] = useState(false)
  const displayIp = "NEXTGSP.com"
  const copyIp = "host1.nextgsp.com:25500"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyIp).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold text-white">
        <Server className="w-8 h-8 text-green-400" />
        <span>Server IP:</span>
      </div>
      <button
        onClick={copyToClipboard}
        className="group flex items-center gap-3 px-6 py-3 bg-opacity-20 bg-white backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all duration-300"
      >
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{displayIp}</span>
        {copied ? (
          <Check className="w-6 h-6 text-green-500" />
        ) : (
          <Copy className="w-6 h-6 text-white opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>
      <span className="text-sm text-gray-300">Klicke zum Kopieren</span>
    </div>
  )
}

