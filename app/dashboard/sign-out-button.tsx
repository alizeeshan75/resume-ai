'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  )
}
