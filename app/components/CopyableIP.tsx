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
    <div className="mb-4 text-center">
      <div className="inline-flex items-center">
        <span className="text-base mr-2 text-gray-300">Server IP:</span>
        <code className="font-mono text-base text-blue-400">{ip}</code>
        <button
          onClick={copyToClipboard}
          className="ml-2 p-1 rounded-full transition-all duration-300 hover:bg-gray-800"
          aria-label="IP-Adresse kopieren"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
        </button>
      </div>
    </div>
  )
}
