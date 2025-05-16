"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gray-900 rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-100">{title}</h2>
              <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-6">{children}</div>

            <div className="mt-8 text-right">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full transition-colors font-medium bg-gray-800 hover:bg-gray-700 text-gray-200"
              >
                Schließen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
