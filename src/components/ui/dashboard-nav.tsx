'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileText, Globe, FileSignature, CreditCard } from 'lucide-react'
import { staggerContainer, fadeUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/efira', label: 'e-FIRA', icon: Globe },
  { href: '/dashboard/contracts', label: 'Contracts', icon: FileSignature },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-3">
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-1"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <motion.li key={item.href} variants={fadeUp}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 border-l-2",
                  isActive
                    ? "border-teal-400 bg-white/10 text-teal-400"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </motion.li>
          )
        })}
      </motion.ul>
    </nav>
  )
}
