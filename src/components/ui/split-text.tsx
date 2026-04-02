'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function SplitText({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.04,
}: SplitTextProps) {
  const shouldReduceMotion = useReducedMotion()

  const words = children.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  }

  const wordAnim: Variants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordAnim}
          className="inline-block"
          style={{ marginRight: i < words.length - 1 ? '0.3em' : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
