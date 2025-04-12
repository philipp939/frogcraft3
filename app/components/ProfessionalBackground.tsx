"use client"

import { useEffect, useRef } from "react"

export default function ProfessionalBackground() {
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

    // Hexagon grid background with subtle animation
    class Hexagon {
      x: number
      y: number
      size: number
      opacity: number
      pulseDirection: number
      pulseSpeed: number
      rotation: number
      rotationSpeed: number

      constructor(x: number, y: number, size: number) {
        this.x = x
        this.y = y
        this.size = size
        this.opacity = Math.random() * 0.15 + 0.05
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1
        this.pulseSpeed = Math.random() * 0.003 + 0.001
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() * 0.0005 + 0.0001) * (Math.random() > 0.5 ? 1 : -1)
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = this.rotation + (Math.PI / 3) * i
          const x = this.x + this.size * Math.cos(angle)
          const y = this.y + this.size * Math.sin(angle)
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(100, 150, 200, ${this.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      update() {
        this.opacity += this.pulseDirection * this.pulseSpeed
        if (this.opacity > 0.2 || this.opacity < 0.05) {
          this.pulseDirection *= -1
        }
        this.rotation += this.rotationSpeed
      }
    }

    const hexagons: Hexagon[] = []
    const hexSize = 40
    const horizontalSpacing = hexSize * Math.sqrt(3)
    const verticalSpacing = hexSize * 1.5

    for (let y = -hexSize; y < canvas.height + hexSize; y += verticalSpacing) {
      const offset = Math.floor(y / verticalSpacing) % 2 === 0 ? 0 : horizontalSpacing / 2
      for (let x = -hexSize; x < canvas.width + hexSize; x += horizontalSpacing) {
        hexagons.push(new Hexagon(x + offset, y, hexSize))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f172a") // Dark blue
      gradient.addColorStop(1, "#1e293b") // Slightly lighter blue
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw hexagons
      hexagons.forEach((hexagon) => {
        hexagon.update()
        hexagon.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}
