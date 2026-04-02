'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Globe, FileSignature, CreditCard, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const mainItems = [
  { href: '/dashboard',          label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/invoices', label: 'Invoices',   icon: FileText },
  { href: '/dashboard/clients',  label: 'Clients',    icon: Users },
  { href: '/dashboard/efira',    label: 'e-FIRA',     icon: Globe },
  { href: '/dashboard/contracts',label: 'Contracts',  icon: FileSignature },
]

const settingsItems = [
  { href: '/dashboard/settings/billing', label: 'Billing',  icon: CreditCard },
  { href: '/dashboard/settings',         label: 'Settings', icon: Settings },
]

function NavSection({
  label,
  items,
  pathname,
}: {
  label: string
  items: typeof mainItems
  pathname: string
}) {
  return (
    <div className="mb-4">
      <p
        className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ color: 'var(--dash-sidebar-muted)' }}
      >
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
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
                    ? 'text-[var(--dash-bg)]'
                    : 'text-[var(--dash-sidebar-muted)] hover:text-[var(--dash-sidebar-fg)] hover:bg-[var(--dash-sidebar-active-bg)]'
                )}
                style={
                  isActive
                    ? { background: 'var(--dash-accent)' }
                    : undefined
                }
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-150',
                    isActive
                      ? 'text-[var(--dash-bg)]'
                      : 'text-[var(--dash-sidebar-muted)] group-hover:text-[var(--dash-sidebar-fg)]'
                  )}
                />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="px-2 pt-2">
      <NavSection label="Dashboards" items={mainItems} pathname={pathname} />
      <NavSection label="Settings" items={settingsItems} pathname={pathname} />
    </nav>
  )
}
