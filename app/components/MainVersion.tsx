"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import MinimalistBackground from "./MinimalistBackground"
import CopyableIP from "./CopyableIP"
import ButtonGrid from "./ButtonGrid"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import WhitelistForm from "./WhitelistForm"

export default function MainVersion() {
  const [scrolled, setScrolled] = useState(false)
  const mainRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main
      ref={mainRef}
      className="min-h-screen flex flex-col items-center relative overflow-hidden text-gray-200 bg-black"
    >
      <MinimalistBackground />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-md shadow-md shadow-gray-900" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-medium text-gray-200">FrogCraft</h2>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#info" className="text-gray-400 hover:text-gray-200 transition-colors">
              Info
            </a>
            <a href="#buttons" className="text-gray-400 hover:text-gray-200 transition-colors">
              Features
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 relative">
        <motion.div style={{ opacity, scale }} className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <Image
              src="/images/logo_clean_thicker.png"
              alt="FrogCraft Logo"
              width={150}
              height={150}
              className="animate-float"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-100"
          >
            FrogCraft
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Ein einzigartiges Minecraft-Erlebnis
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-red-900/20 border border-red-800/30 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
              <p className="text-red-400 font-medium">Derzeit ist kein Server aktiv</p>
              <p className="text-red-300/70 mt-1">Ein neuer Server wird in ein paar Monaten verfügbar sein.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <CopyableIP />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        >
          <a href="#info" className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">Scroll für mehr</p>
            <ArrowDown className="w-5 h-5 text-gray-500 animate-bounce" />
          </a>
        </motion.div>
      </section>

      {/* Info Section */}
      <section id="info" className="w-full py-24 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
              Für Informationen zu zukünftigen Servern
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tritt unserem{" "}
              <a
                href="https://discord.gg/H2yX7d8Bmv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Discord
              </a>{" "}
              bei! Dort erhältst du alle Neuigkeiten und Updates zu kommenden Servern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Buttons Section */}
      <section id="buttons" className="w-full py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">Entdecke FrogCraft</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Alles was du über unseren Minecraft-Server wissen musst
            </p>
          </motion.div>

          <ButtonGrid />

          {/* Whitelist Section */}
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">Server Whitelist</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Trage dich hier ein, um auf unserem Server spielen zu können
              </p>
            </motion.div>

            <WhitelistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 text-center text-gray-500">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center mb-4">
            <span>FrogCraft</span>
          </div>
          <p>© {new Date().getFullYear()} FrogCraft. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </main>
  )
}
