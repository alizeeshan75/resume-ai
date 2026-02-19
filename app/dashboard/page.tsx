import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Sparkles, FileText, Mic, Plus, LogOut, ChevronRight } from 'lucide-react'
import SignOutButton from './sign-out-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const initials = (user.user_metadata?.full_name as string)
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? user.email?.[0].toUpperCase() ?? '?'

  const displayName = (user.user_metadata?.full_name as string) ?? user.email ?? 'User'

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-red-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">ResumeAI</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-red-500 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="hidden text-sm text-neutral-400 sm:block">{displayName}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white">
            Good to see you, {displayName.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Let&apos;s build something that gets you hired.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: 'Resumes', value: '0', icon: FileText },
            { label: 'Interview sessions', value: '0', icon: Mic },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Icon className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Empty state CTA */}
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
            <FileText className="h-6 w-6 text-amber-400" />
          </div>
          <h2 className="mb-2 text-base font-semibold text-white">Create your first resume</h2>
          <p className="mb-6 text-sm text-neutral-500">
            Tell us your experience and target role — we&apos;ll handle the rest.
          </p>
          <Link
            href="/dashboard/resumes/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Build My Resume
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            {
              href: '/dashboard/resumes',
              icon: FileText,
              title: 'My Resumes',
              desc: 'View and manage all your resume versions',
            },
            {
              href: '/dashboard/interview',
              icon: Mic,
              title: 'Interview Prep',
              desc: 'Practice with AI-powered mock interviews',
            },
          ].map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all hover:border-amber-500/20 hover:bg-amber-500/[0.04]"
            >
              <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Icon className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="truncate text-xs text-neutral-500">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-700 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
