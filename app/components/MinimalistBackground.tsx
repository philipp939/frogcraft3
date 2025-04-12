"use client"

import { useEffect, useRef } from "react"

export default function MinimalistBackground() {
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

    // Subtle dot grid
    class Dot {
      x: number
      y: number
      size: number
      opacity: number
      maxOpacity: number
      pulseDirection: number
      pulseSpeed: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = 1
        this.maxOpacity = Math.random() * 0.15 + 0.05
        this.opacity = this.maxOpacity
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1
        this.pulseSpeed = Math.random() * 0.002 + 0.001
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fill()
      }

      update() {
        this.opacity += this.pulseDirection * this.pulseSpeed
        if (this.opacity > this.maxOpacity || this.opacity < 0.02) {
          this.pulseDirection *= -1
        }
      }
    }

    const dots: Dot[] = []
    const spacing = 30

    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < canvas.width; x += spacing) {
        dots.push(new Dot(x, y))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw black background
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw dots
      dots.forEach((dot) => {
        dot.update()
        dot.draw(ctx)
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
