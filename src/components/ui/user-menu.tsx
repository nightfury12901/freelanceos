'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { signOut } from "@/app/auth/actions"

export function UserMenu({ email }: { email: string }) {
  const initials = email?.substring(0, 2).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 px-2 py-2.5 rounded-[8px] text-left outline-none transition-colors hover:bg-[var(--dash-sidebar-active-bg)]">
        {/* Avatar */}
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold"
          style={{
            background: 'var(--dash-accent)',
            color: '#fff',
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>
        <span
          className="truncate text-[13px] font-medium"
          style={{ color: 'var(--dash-sidebar-muted)' }}
        >
          {email}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        style={{
          background: '#1e1d1b',
          border: '1px solid var(--dash-sidebar-border)',
          color: 'var(--dash-sidebar-fg)',
          borderRadius: '8px',
        }}
        align="end"
      >
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <p className="text-[11px] font-medium" style={{ color: 'var(--dash-sidebar-muted)' }}>Signed in as</p>
          <p className="text-[13px] font-medium break-all mt-0.5" style={{ color: 'var(--dash-sidebar-fg)' }}>{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ background: 'var(--dash-sidebar-border)' }} />
        <DropdownMenuItem
          className="text-[13px] cursor-pointer px-3 py-2 rounded-[6px]"
          style={{ color: 'var(--dash-sidebar-muted)' }}
        >
          <User className="mr-2 h-3.5 w-3.5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-[13px] cursor-pointer px-3 py-2 rounded-[6px]"
          style={{ color: '#f87171' }}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
