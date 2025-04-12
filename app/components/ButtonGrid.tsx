"use client"

import { motion } from "framer-motion"
import InfoButton from "./InfoButton"
import RulesButton from "./RulesButton"
import CommandsButton from "./CommandsButton"
import KeybindsButton from "./KeybindsButton"
import DiscordButton from "./DiscordButton"
import ModpackButton from "./ModpackButton"

interface ButtonGridProps {
  theme: "light" | "dark"
}

export default function ButtonGrid({ theme }: ButtonGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      <InfoButton theme={theme} />
      <RulesButton theme={theme} />
      <CommandsButton theme={theme} />
      <KeybindsButton theme={theme} />
      <DiscordButton theme={theme} />
      <ModpackButton theme={theme} />
    </motion.div>
  )
}
