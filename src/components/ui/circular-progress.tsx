'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CircularProgressProps {
  value: number // 0 to 100
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
}

// Fixed r=54 as per spec
const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const VIEWBOX_SIZE = 120 // 54*2 + strokeWidth*2 ≈ 120

export function CircularProgress({
  value,
  size = 160,
  strokeWidth = 10,
  color = '#6EACDA',
  trackColor = 'rgba(110, 172, 218, 0.08)',
}: CircularProgressProps) {
  const [mounted, setMounted] = useState(false)

  const center = VIEWBOX_SIZE / 2
  const finalOffset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE
  const strokeDashoffset = mounted ? finalOffset : CIRCUMFERENCE

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(t)
  }, [])

  const gradientId = `progress-gradient-${Math.round(value)}`

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 0 12px rgba(110, 172, 218, 0.4))' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EACDA" />
            <stop offset="50%" stopColor="#4ecdc4" />
            <stop offset="100%" stopColor="#6EACDA" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={RADIUS}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>

      {/* Center label */}
      <div className="absolute flex flex-col items-center justify-center text-[#E8EEF4]">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="text-4xl font-black tracking-tighter"
          style={{ color }}
        >
          {value}
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6EACDA]/60 -mt-1">
          Score
        </span>
      </div>
    </div>
  )
}
