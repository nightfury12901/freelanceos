'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Globe, FileSignature, CreditCard, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',                  label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/invoices',         label: 'Invoices',   icon: FileText },
  { href: '/dashboard/clients',          label: 'Clients',    icon: Users },
  { href: '/dashboard/efira',            label: 'e-FIRA',     icon: Globe },
  { href: '/dashboard/contracts',        label: 'Contracts',  icon: FileSignature },
  { href: '/dashboard/settings/billing', label: 'Billing',    icon: CreditCard },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="px-2 pt-2">
      <ul className="space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-[var(--dash-sidebar-active-bg)] text-[var(--dash-sidebar-fg)]'
                    : 'text-[var(--dash-sidebar-muted)] hover:text-[var(--dash-sidebar-fg)] hover:bg-[var(--dash-sidebar-active-bg)]'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-150',
                    isActive
                      ? 'text-[var(--dash-accent)]'
                      : 'text-[var(--dash-sidebar-muted)] group-hover:text-[var(--dash-sidebar-fg)]'
                  )}
                />
                {item.label}

                {/* Active left indicator */}
                {isActive && (
                  <span
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--dash-accent)' }}
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
