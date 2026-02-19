'use client'

import { useRef } from 'react'
import { Download, FileText } from 'lucide-react'

export interface ResumeContent {
  personal: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string
  }
  summary: string
  experience: Array<{
    company: string
    role: string
    location: string
    startDate: string
    endDate: string
    isCurrent: boolean
    bullets: string[]
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    gpa?: string
    startDate: string
    endDate: string
  }>
  skills: string[]
}

// ─── Download helpers ────────────────────────────────────────────────────────

function buildWordHtml(content: ResumeContent): string {
  const { personal, summary, experience, education, skills } = content

  const experienceHtml = experience
    .map(
      (exp) => `
      <div style="margin-bottom:16px">
        <p style="margin:0;font-weight:bold;font-size:11pt">${exp.role} — ${exp.company}</p>
        <p style="margin:0;color:#666;font-size:10pt">${exp.location} &nbsp;|&nbsp; ${exp.startDate} – ${exp.isCurrent ? 'Present' : exp.endDate}</p>
        <ul style="margin:6px 0 0 0;padding-left:20px">
          ${exp.bullets.map((b) => `<li style="font-size:10pt;margin-bottom:3px">${b}</li>`).join('')}
        </ul>
      </div>`,
    )
    .join('')

  const educationHtml = education
    .map(
      (edu) => `
      <div style="margin-bottom:10px">
        <p style="margin:0;font-weight:bold;font-size:11pt">${edu.degree} in ${edu.field}</p>
        <p style="margin:0;color:#666;font-size:10pt">${edu.school}${edu.gpa ? ` &nbsp;·&nbsp; GPA: ${edu.gpa}` : ''} &nbsp;|&nbsp; ${edu.startDate} – ${edu.endDate}</p>
      </div>`,
    )
    .join('')

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${personal.name} — Resume</title>
      <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; color: #111; margin: 72pt; }
        h1 { font-size: 20pt; margin: 0 0 4pt 0; }
        h2 { font-size: 11pt; border-bottom: 1pt solid #ccc; padding-bottom: 3pt; margin: 16pt 0 8pt 0; text-transform: uppercase; letter-spacing: 0.5pt; color: #555; }
        p { margin: 0 0 4pt 0; }
        .contact { font-size: 10pt; color: #444; }
      </style>
    </head>
    <body>
      <h1>${personal.name}</h1>
      <p class="contact">
        ${[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' &nbsp;·&nbsp; ')}
      </p>

      ${summary ? `<h2>Professional Summary</h2><p style="font-size:10.5pt;line-height:1.5">${summary}</p>` : ''}

      ${experience.length ? `<h2>Experience</h2>${experienceHtml}` : ''}

      ${education.length ? `<h2>Education</h2>${educationHtml}` : ''}

      ${
        skills.length
          ? `<h2>Skills</h2><p style="font-size:10pt">${skills.join(' &nbsp;·&nbsp; ')}</p>`
          : ''
      }
    </body>
    </html>`
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResumePreview({
  content,
  resumeId,
}: {
  content: ResumeContent
  resumeId: string | null
}) {
  const printRef = useRef<HTMLDivElement>(null)
  const { personal, summary, experience, education, skills } = content

  function handlePdfDownload() {
    const printContents = printRef.current?.innerHTML
    if (!printContents) return

    const win = window.open('', '_blank')
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>${personal.name} — Resume</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; font-size: 10.5pt; color: #111; padding: 48pt 56pt; }
            h1 { font-size: 22pt; font-weight: 700; letter-spacing: -0.5pt; }
            .contact { font-size: 9pt; color: #555; margin-top: 4pt; display: flex; flex-wrap: wrap; gap: 8pt; }
            hr { border: none; border-top: 1pt solid #ddd; margin: 14pt 0; }
            h2 { font-size: 8pt; font-weight: 700; letter-spacing: 1.5pt; text-transform: uppercase; color: #888; margin-bottom: 10pt; }
            .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
            .exp-role { font-weight: 700; font-size: 10.5pt; }
            .exp-company { color: #555; font-size: 9.5pt; margin-top: 1pt; }
            .exp-date { font-size: 9pt; color: #888; text-align: right; }
            ul { margin: 6pt 0 0 14pt; }
            li { font-size: 10pt; margin-bottom: 3pt; line-height: 1.45; }
            .section { margin-bottom: 18pt; }
            .edu-row { display: flex; justify-content: space-between; margin-bottom: 8pt; }
            .edu-name { font-weight: 600; font-size: 10pt; }
            .edu-school { color: #555; font-size: 9.5pt; margin-top: 1pt; }
            .skills { display: flex; flex-wrap: wrap; gap: 5pt; }
            .skill { background: #f2f2f2; border-radius: 3pt; padding: 2pt 7pt; font-size: 9pt; }
            @media print { body { padding: 36pt 48pt; } }
          </style>
        </head>
        <body>${printContents}</body>
      </html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  function handleWordDownload() {
    const html = buildWordHtml(content)
    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${personal.name.replace(/\s+/g, '_')}_Resume.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Download bar */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-neutral-600">
          {resumeId ? '✓ Saved to your account' : 'Preview'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleWordDownload}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Word (.doc)
          </button>
          <button
            onClick={handlePdfDownload}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-red-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
        </div>
      </div>

      {/* Resume document */}
      <div className="overflow-auto rounded-2xl border border-white/[0.06] bg-white shadow-2xl shadow-black/40">
        <div ref={printRef} className="p-8 text-neutral-900">
          {/* Header */}
          <h1 className="text-2xl font-bold leading-tight text-neutral-900">{personal.name}</h1>
          <div className="contact mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
          <hr className="my-5 border-neutral-200" />

          {/* Summary */}
          {summary && (
            <section className="section mb-5">
              <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-400">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-neutral-700">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <section className="section mb-5">
              <h2 className="mb-3 text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-400">
                Experience
              </h2>
              <div className="space-y-5">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="exp-header flex flex-wrap items-start justify-between gap-1">
                      <div>
                        <p className="exp-role text-sm font-semibold text-neutral-900">{exp.role}</p>
                        <p className="exp-company mt-0.5 text-xs text-neutral-500">
                          {exp.company}
                          {exp.location ? ` · ${exp.location}` : ''}
                        </p>
                      </div>
                      <p className="exp-date text-xs text-neutral-400">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-3.5">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="flex gap-2 text-sm text-neutral-700">
                            <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section className="section mb-5">
              <h2 className="mb-3 text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-400">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="edu-row flex flex-wrap items-start justify-between gap-1">
                    <div>
                      <p className="edu-name text-sm font-semibold text-neutral-900">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="edu-school mt-0.5 text-xs text-neutral-500">
                        {edu.school}
                        {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {edu.startDate} – {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <section>
              <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-400">
                Skills
              </h2>
              <div className="skills flex flex-wrap gap-1.5">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="skill rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
