import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div
          className="h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: 'rgba(245,158,11,0.06)' }}
        />
      </div>

      {/* Logo */}
      <Link href="/" className="relative z-10 mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-red-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold tracking-tight text-white">ResumeAI</span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  )
}
