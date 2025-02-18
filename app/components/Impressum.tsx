"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import Modal from "./Modal"

export default function Impressum() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
      >
        <FileText className="mr-2 h-4 w-4" />
        Impressum
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Impressum">
        <div className="space-y-4 text-gray-300">
          <p>FrogCraft Minecraft Server</p>
          <p>Betreiber: Max Mustermann</p>
          <p>Musterstraße 123</p>
          <p>12345 Musterstadt</p>
          <p>Deutschland</p>
          <p>E-Mail: kontakt@frogcraft.de</p>
          <p>Telefon: +49 123 4567890</p>
          <p className="mt-6 font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</p>
          <p>Max Mustermann</p>
          <p>Musterstraße 123</p>
          <p>12345 Musterstadt</p>
          <p className="mt-6">
            Plattform der EU-Kommission zur Online-Streitbeilegung:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
          <p>
            Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder
            verpflichtet noch bereit.
          </p>
        </div>
      </Modal>
    </>
  )
}

