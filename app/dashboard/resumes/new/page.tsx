'use client'

import { useState, KeyboardEvent } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, Loader2, Sparkles, X, FileText,
  User, Briefcase, GraduationCap, Zap, MapPin,
} from 'lucide-react'
import ResumePreview, { type ResumeContent } from './resume-preview'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Personal {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
}

interface ExperienceEntry {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

interface EducationEntry {
  id: string
  school: string
  degree: string
  field: string
  gpa: string
  startDate: string
  endDate: string
}

interface BuilderForm {
  title: string
  personal: Personal
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  targetRegion: string
  targetIndustry: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const REGIONS = ['US', 'UK', 'EU', 'MENA', 'Asia']

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Creative',
  'Marketing', 'Consulting', 'Education', 'Legal',
]

const emptyExperience = (): ExperienceEntry => ({
  id: crypto.randomUUID(),
  role: '', company: '', location: '',
  startDate: '', endDate: '',
  isCurrent: false, description: '',
})

const emptyEducation = (): EducationEntry => ({
  id: crypto.randomUUID(),
  school: '', degree: '', field: '',
  gpa: '', startDate: '', endDate: '',
})

// ─── Shared primitives ───────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 transition-colors focus:border-amber-500/50 focus:bg-white/[0.07] focus:outline-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-neutral-400">{label}</label>
      {children}
    </div>
  )
}

function SectionHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </h3>
  )
}

// ─── Skills tag input ────────────────────────────────────────────────────────

function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [value, setValue] = useState('')

  function commit(raw: string) {
    const trimmed = raw.replace(/,/g, '').trim()
    if (trimmed && !skills.includes(trimmed)) onChange([...skills, trimmed])
    setValue('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(value) }
    if (e.key === 'Backspace' && !value && skills.length) onChange(skills.slice(0, -1))
  }

  return (
    <div className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 p-3">
      {skills.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300">
              {s}
              <button type="button" onClick={() => onChange(skills.filter((x) => x !== s))}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => value && commit(value)}
        placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : 'Add another…'}
        className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
      />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NewResumePage() {
  const [form, setForm] = useState<BuilderForm>({
    title: '',
    personal: { name: '', email: '', phone: '', location: '', linkedin: '' },
    experience: [emptyExperience()],
    education: [emptyEducation()],
    skills: [],
    targetRegion: 'US',
    targetIndustry: 'Technology',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ content: ResumeContent; resumeId: string | null } | null>(null)

  // Setters
  function setPersonal(u: Partial<Personal>) {
    setForm((f) => ({ ...f, personal: { ...f.personal, ...u } }))
  }
  function updateExp(id: string, u: Partial<ExperienceEntry>) {
    setForm((f) => ({ ...f, experience: f.experience.map((e) => e.id === id ? { ...e, ...u } : e) }))
  }
  function removeExp(id: string) {
    setForm((f) => ({ ...f, experience: f.experience.filter((e) => e.id !== id) }))
  }
  function updateEdu(id: string, u: Partial<EducationEntry>) {
    setForm((f) => ({ ...f, education: f.education.map((e) => e.id === id ? { ...e, ...u } : e) }))
  }
  function removeEdu(id: string) {
    setForm((f) => ({ ...f, education: f.education.filter((e) => e.id !== id) }))
  }

  async function handleGenerate() {
    if (!form.personal.name.trim()) { setError('Please enter your full name.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setResult({ content: data.content, resumeId: data.resumeId })
      // Scroll preview into view on mobile
      setTimeout(() => document.getElementById('preview-panel')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-neutral-950/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Link href="/dashboard" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">Resume Builder</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Generating…' : result ? 'Regenerate' : 'Generate Resume'}
          </button>
        </div>
      </header>

      {/* Error bar */}
      {error && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-3 text-center text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Two-column body */}
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">

        {/* ── LEFT: Form ─────────────────────────────────────────────────────── */}
        <div className="divide-y divide-white/[0.05] border-r border-white/[0.05] px-6 py-8 space-y-0">

          {/* Resume title */}
          <section className="pb-8">
            <SectionHeading icon={FileText}>Resume Info</SectionHeading>
            <Field label="Resume title">
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Software Engineer — Google Application 2025"
              />
            </Field>
          </section>

          {/* Personal info */}
          <section className="py-8">
            <SectionHeading icon={User}>Personal Info</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Full name *">
                  <input className={inputCls} value={form.personal.name}
                    onChange={(e) => setPersonal({ name: e.target.value })} placeholder="Jane Smith" />
                </Field>
              </div>
              <Field label="Email">
                <input type="email" className={inputCls} value={form.personal.email}
                  onChange={(e) => setPersonal({ email: e.target.value })} placeholder="jane@example.com" />
              </Field>
              <Field label="Phone">
                <input className={inputCls} value={form.personal.phone}
                  onChange={(e) => setPersonal({ phone: e.target.value })} placeholder="+1 555 000 0000" />
              </Field>
              <Field label="Location">
                <input className={inputCls} value={form.personal.location}
                  onChange={(e) => setPersonal({ location: e.target.value })} placeholder="New York, NY" />
              </Field>
              <Field label="LinkedIn">
                <input className={inputCls} value={form.personal.linkedin}
                  onChange={(e) => setPersonal({ linkedin: e.target.value })} placeholder="linkedin.com/in/jane" />
              </Field>
            </div>
          </section>

          {/* Experience */}
          <section className="py-8">
            <SectionHeading icon={Briefcase}>Experience</SectionHeading>
            <div className="space-y-4">
              {form.experience.map((exp, i) => (
                <div key={exp.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-600">Position {i + 1}</span>
                    {form.experience.length > 1 && (
                      <button type="button" onClick={() => removeExp(exp.id)}
                        className="text-neutral-700 transition-colors hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Job title">
                      <input className={inputCls} value={exp.role}
                        onChange={(e) => updateExp(exp.id, { role: e.target.value })} placeholder="Senior Engineer" />
                    </Field>
                    <Field label="Company">
                      <input className={inputCls} value={exp.company}
                        onChange={(e) => updateExp(exp.id, { company: e.target.value })} placeholder="Acme Corp" />
                    </Field>
                    <Field label="Location">
                      <input className={inputCls} value={exp.location}
                        onChange={(e) => updateExp(exp.id, { location: e.target.value })} placeholder="San Francisco, CA" />
                    </Field>
                    <Field label="Start date">
                      <input className={inputCls} value={exp.startDate}
                        onChange={(e) => updateExp(exp.id, { startDate: e.target.value })} placeholder="Jan 2022" />
                    </Field>
                    <div className="sm:col-span-2">
                      <label className="mb-2 flex cursor-pointer items-center gap-2">
                        <input type="checkbox" checked={exp.isCurrent}
                          onChange={(e) => updateExp(exp.id, { isCurrent: e.target.checked })}
                          className="accent-amber-500" />
                        <span className="text-xs text-neutral-400">I currently work here</span>
                      </label>
                      {!exp.isCurrent && (
                        <Field label="End date">
                          <input className={inputCls} value={exp.endDate}
                            onChange={(e) => updateExp(exp.id, { endDate: e.target.value })} placeholder="Mar 2024" />
                        </Field>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="What did you do? (AI will turn this into STAR bullets)">
                        <textarea
                          className={`${inputCls} resize-none`}
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExp(exp.id, { description: e.target.value })}
                          placeholder="e.g. Led backend API redesign, reduced latency by 40%. Managed a team of 5 engineers. Shipped payment integration with Stripe."
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => setForm((f) => ({ ...f, experience: [...f.experience, emptyExperience()] }))}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-xs text-neutral-500 transition-colors hover:border-amber-500/30 hover:text-amber-400">
                <Plus className="h-3.5 w-3.5" /> Add position
              </button>
            </div>
          </section>

          {/* Education */}
          <section className="py-8">
            <SectionHeading icon={GraduationCap}>Education</SectionHeading>
            <div className="space-y-4">
              {form.education.map((edu, i) => (
                <div key={edu.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-600">Entry {i + 1}</span>
                    {form.education.length > 1 && (
                      <button type="button" onClick={() => removeEdu(edu.id)}
                        className="text-neutral-700 transition-colors hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="School / University">
                        <input className={inputCls} value={edu.school}
                          onChange={(e) => updateEdu(edu.id, { school: e.target.value })} placeholder="MIT" />
                      </Field>
                    </div>
                    <Field label="Degree">
                      <input className={inputCls} value={edu.degree}
                        onChange={(e) => updateEdu(edu.id, { degree: e.target.value })} placeholder="BSc" />
                    </Field>
                    <Field label="Field of study">
                      <input className={inputCls} value={edu.field}
                        onChange={(e) => updateEdu(edu.id, { field: e.target.value })} placeholder="Computer Science" />
                    </Field>
                    <Field label="Start year">
                      <input className={inputCls} value={edu.startDate}
                        onChange={(e) => updateEdu(edu.id, { startDate: e.target.value })} placeholder="2018" />
                    </Field>
                    <Field label="End year">
                      <input className={inputCls} value={edu.endDate}
                        onChange={(e) => updateEdu(edu.id, { endDate: e.target.value })} placeholder="2022" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="GPA (optional)">
                        <input className={inputCls} value={edu.gpa}
                          onChange={(e) => updateEdu(edu.id, { gpa: e.target.value })} placeholder="3.9 / 4.0" />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => setForm((f) => ({ ...f, education: [...f.education, emptyEducation()] }))}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-xs text-neutral-500 transition-colors hover:border-amber-500/30 hover:text-amber-400">
                <Plus className="h-3.5 w-3.5" /> Add education
              </button>
            </div>
          </section>

          {/* Skills */}
          <section className="py-8">
            <SectionHeading icon={Zap}>Skills</SectionHeading>
            <SkillsInput skills={form.skills} onChange={(skills) => setForm((f) => ({ ...f, skills }))} />
            <p className="mt-2 text-xs text-neutral-700">
              Press <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-neutral-500">Enter</kbd> or comma to add.
              AI will also suggest relevant skills.
            </p>
          </section>

          {/* Target */}
          <section className="py-8">
            <SectionHeading icon={MapPin}>Target</SectionHeading>

            <div className="mb-5">
              <p className="mb-2.5 text-xs font-medium text-neutral-400">Region</p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button key={r} type="button"
                    onClick={() => setForm((f) => ({ ...f, targetRegion: r }))}
                    className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                      form.targetRegion === r
                        ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/20'
                        : 'border border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-xs font-medium text-neutral-400">Industry</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {INDUSTRIES.map((ind) => (
                  <button key={ind} type="button"
                    onClick={() => setForm((f) => ({ ...f, targetIndustry: ind }))}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      form.targetIndustry === ind
                        ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/20'
                        : 'border border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}>
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile generate button */}
          <div className="pt-8 lg:hidden">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:opacity-90 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Generating…' : result ? 'Regenerate' : 'Generate Resume'}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Preview ─────────────────────────────────────────────────── */}
        <div id="preview-panel" className="px-6 py-8">
          <div className="lg:sticky lg:top-[73px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Preview
            </p>

            {loading ? (
              <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                  <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-400">Gemini is crafting your resume…</p>
                  <p className="mt-1 text-xs text-neutral-600">Writing STAR bullets · Adapting for {form.targetRegion} · Tuning for {form.targetIndustry}</p>
                </div>
              </div>
            ) : result ? (
              <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
                <ResumePreview content={result.content} resumeId={result.resumeId} />
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                <FileText className="h-8 w-8 text-neutral-800" />
                <p className="text-sm text-neutral-600">Your resume will appear here</p>
                <p className="text-xs text-neutral-700">Fill in your details and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
