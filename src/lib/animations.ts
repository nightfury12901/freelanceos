import type { Variants } from "framer-motion";

// ─── Entrance Animations ───────────────────────────────────────────────────

/** Fade up from 20px below, 300ms */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fade in only, 300ms */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

/** Slide up from 60px — used for hero kinetic text */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Scale from 95% — used for modal entrances */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ─── Container (stagger children) ─────────────────────────────────────────

/** Stagger all children with 0.08s delay */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Slower stagger for hero text words */
export const kineticContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

/** Faster stagger for nav items */
export const navStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

// ─── Hover / Interactive ───────────────────────────────────────────────────

/** Card 3D hover lift — translate Y, no scale (prevents layout shift) */
export const cardHover = {
  whileHover: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

/** Subtle scale hover for buttons */
export const buttonHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

// ─── Page Transitions ──────────────────────────────────────────────────────

/** Full page slide-up — Olivier Larose style */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

/** Animate presence for pricing toggle number */
export const priceSlide: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/** AnimatePresence for modal slide-up */
export const modalSlideUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// ─── Utility: Respect reduced motion ──────────────────────────────────────

/** Wrap variants to disable animation when prefers-reduced-motion is set */
export function reducedMotionVariants(variants: Variants): Variants {
  // Note: Use with useReducedMotion() hook in Client Components
  // If reduced motion: return instant variants (no animation)
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
    exit: { opacity: 0, transition: { duration: 0 } },
    ...variants,
  };
}
