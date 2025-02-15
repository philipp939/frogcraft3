"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    class Hexagon {
      x: number
      y: number
      size: number
      color: string
      speed: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 20 + 10
        this.color = `rgba(0, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.random() * 0.5 + 0.1})`
        this.speed = Math.random() * 0.5 + 0.1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(
            this.x + this.size * Math.cos((i * 2 * Math.PI) / 6),
            this.y + this.size * Math.sin((i * 2 * Math.PI) / 6),
          )
        }
        ctx.closePath()
        ctx.fillStyle = this.color
        ctx.fill()
      }

      update() {
        this.y += this.speed
        if (this.y > canvas.height + this.size) {
          this.y = -this.size
          this.x = Math.random() * canvas.width
        }
      }
    }

    const hexagons: Hexagon[] = []
    for (let i = 0; i < 50; i++) {
      hexagons.push(new Hexagon(Math.random() * canvas.width, Math.random() * canvas.height))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      hexagons.forEach((hexagon) => {
        hexagon.update()
        hexagon.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-gray-900 to-blue-900"
    />
  )
}

export default FuturisticBackground

