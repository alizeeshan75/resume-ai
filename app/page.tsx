import Link from 'next/link'
import {
  Globe,
  Sparkles,
  BriefcaseBusiness,
  ShieldCheck,
  LayoutTemplate,
  Mic,
  ArrowRight,
  Github,
  Twitter,
} from 'lucide-react'

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-6 py-4">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/[0.08] bg-neutral-950/80 px-5 py-3 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-red-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            ResumeAI
          </span>
        </Link>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-4 py-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-amber-500 to-red-500 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  )
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow — amber left, red right */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-[60%] -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: 'rgba(245,158,11,0.12)' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-[40%] -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: 'rgba(239,68,68,0.10)' }}
        />
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
          Powered by Gemini AI
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Your resume,{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #F59E0B, #F97316, #EF4444)',
            }}
          >
            perfected
          </span>{' '}
          for every market
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-neutral-400">
          AI-powered resume builder that formats for US, UK, EU, MENA, and Asia —
          tuned to your industry and optimised for ATS systems.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:opacity-90 hover:shadow-amber-500/30"
          >
            Build My Resume
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
          >
            See features
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-xs text-neutral-600">
          No credit card required · Free to start
        </p>
      </div>
    </section>
  )
}

// ─── Features ───────────────────────────────────────────────────────────────

const features = [
  {
    icon: Globe,
    title: 'Regional Formatting',
    description:
      'Automatically adapts layout, tone, and conventions for US, UK, EU, MENA, and Asia markets.',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Writing',
    description:
      'Bullet points crafted with the STAR method — structured, metrics-driven, and compelling.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Industry-Specific',
    description:
      'Tailored optimisation for Tech, Finance, Healthcare, Creative, and more.',
  },
  {
    icon: ShieldCheck,
    title: 'ATS Optimised',
    description:
      'Keyword analysis and scoring so your resume gets past applicant tracking systems.',
  },
  {
    icon: LayoutTemplate,
    title: 'Multiple Templates',
    description:
      'Modern, classic, and minimal designs — all export-ready as clean PDFs.',
  },
  {
    icon: Mic,
    title: 'Interview Prep',
    description:
      'AI mock interviews based on your resume and target role, with scored feedback.',
  },
]

function Features() {
  return (
    <section id="features" className="px-6 pb-32">
      <div className="mx-auto max-w-5xl">
        {/* Section label */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything your resume needs
          </h2>
          <p className="mt-4 text-neutral-400">
            One tool. Every market. Your best application yet.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all hover:border-amber-500/20 hover:bg-amber-500/[0.04]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Icon className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ─────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-neutral-950 px-10 py-16 text-center">
          {/* Gradient top border accent */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, #F59E0B, #EF4444, transparent)',
            }}
          />

          {/* Split glow */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-[60%] -translate-y-1/2 rounded-full blur-[80px]"
              style={{ background: 'rgba(245,158,11,0.18)' }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-[40%] -translate-y-1/2 rounded-full blur-[80px]"
              style={{ background: 'rgba(239,68,68,0.14)' }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to land your next role?
            </h2>
            <p className="mb-8 text-neutral-400">
              Join thousands building smarter resumes with AI.
            </p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:opacity-90 hover:shadow-amber-500/30"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-red-500">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">ResumeAI</span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6 text-xs text-neutral-500">
          <Link href="#features" className="transition-colors hover:text-white">
            Features
          </Link>
          <Link href="/login" className="transition-colors hover:text-white">
            Log in
          </Link>
          <Link href="/signup" className="transition-colors hover:text-white">
            Sign up
          </Link>
        </nav>

        {/* Social */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 transition-colors hover:text-amber-400"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 transition-colors hover:text-amber-400"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-700">
        © {new Date().getFullYear()} ResumeAI. All rights reserved.
      </p>
    </footer>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <CTABanner />
      <Footer />
    </div>
  )
}
