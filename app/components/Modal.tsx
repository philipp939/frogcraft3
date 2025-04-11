"use client"

import { motion, AnimatePresence } from "framer-motion"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-700 shadow-xl"
            style={{ borderRadius: "0.5rem" }}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-300">{title}</h2>
            {children}
            <button
              onClick={onClose}
              className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300 border border-gray-600"
              style={{ borderRadius: "0.375rem" }}
            >
              Schließen
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
