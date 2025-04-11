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
    <div className="mb-6 text-center">
      <div className="inline-flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-gray-700">
        <span className="text-xl font-medium mr-3">Zukünftige Server IP:</span>
        <code className="bg-gray-900 px-3 py-1 rounded text-blue-300 font-mono">{ip}</code>
        <button
          onClick={copyToClipboard}
          className="ml-3 p-2 rounded-md hover:bg-gray-700 transition-colors"
          aria-label="IP-Adresse kopieren"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
        </button>
      </div>
    </div>
  )
}
