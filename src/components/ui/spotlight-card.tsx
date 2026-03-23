'use client'

import React, { useRef, MouseEvent, ReactNode } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  style?: React.CSSProperties
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(110, 172, 218, 0.08)',
  style,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const spot = spotRef.current
    if (!card || !spot) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    spot.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`
    spot.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    const spot = spotRef.current
    if (spot) spot.style.opacity = '0'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
