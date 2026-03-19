'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { signOut } from "@/app/auth/actions"

export function UserMenu({ email }: { email: string }) {
  const initials = email?.substring(0, 2).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-start gap-3 px-2 py-2 hover:bg-white/5 text-slate-300 rounded-md outline-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold ring-1 ring-teal-500/30">
            {initials}
          </div>
          <span className="truncate text-sm font-medium">{email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1e293b] border-white/10 text-slate-300" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">Account</p>
            <p className="text-xs leading-none text-slate-400 break-all">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="text-red-400 focus:bg-red-400/10 focus:text-red-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
