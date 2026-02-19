import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const REGION_GUIDELINES: Record<string, string> = {
  US: 'Use strong action verbs (Led, Built, Increased, Reduced, Drove). Quantify every achievement with metrics (%, $, #). Concise American business English. Implied first person — no "I". Tailor for competitive US job market.',
  UK: 'Formal British English. Spell per UK conventions (organise, maximise, behaviour). Write a personal statement style summary. Professional and understated tone. CV format conventions.',
  EU: 'Formal European tone. Highlight language skills and academic credentials. Consider multicultural professional context. Europass-influenced conventions. Mention certifications and formal qualifications prominently.',
  MENA: 'Formal, respectful tone. Emphasise leadership, team management, and organisational contributions. Highlight years of experience prominently. Professional Arabic-market conventions where relevant.',
  Asia: 'Respectful formal tone. Highlight team contributions alongside individual achievements. Emphasise academic qualifications, certifications, and institutional affiliations. Tenure and loyalty valued.',
}

const INDUSTRY_KEYWORDS: Record<string, string> = {
  Technology: 'software engineering, agile/scrum, APIs, cloud infrastructure, DevOps, CI/CD, scalability, system design, microservices, product-led',
  Finance: 'financial modelling, P&L management, ROI optimisation, risk management, regulatory compliance, portfolio management, capital markets, due diligence',
  Healthcare: 'patient outcomes, clinical workflows, evidence-based practice, multidisciplinary collaboration, quality improvement, HIPAA/regulatory compliance',
  Creative: 'brand identity, campaign performance, creative direction, content strategy, stakeholder engagement, visual storytelling, cross-functional collaboration',
  Marketing: 'conversion rate optimisation, CAC/LTV, demand generation, growth marketing, SEO/SEM, campaign analytics, marketing automation',
  Consulting: 'strategic analysis, stakeholder management, project deliverables, business transformation, frameworks, executive communication, change management',
  Education: 'curriculum development, learning outcomes, student engagement, differentiated instruction, academic achievement, programme design',
  Legal: 'regulatory compliance, due diligence, contract negotiation, litigation support, legal research, risk assessment, counsel',
}

export async function POST(request: NextRequest) {
  const start = Date.now()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { formData } = await request.json()
  const { targetRegion, targetIndustry } = formData

  const regionGuide = REGION_GUIDELINES[targetRegion] ?? REGION_GUIDELINES.US
  const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry] ?? ''

  const prompt = `You are a world-class professional resume writer specialising in the ${targetRegion} job market and ${targetIndustry} industry.

Transform the user's raw input into a polished, ATS-optimised resume.

═══════════════════════════════════════
REGIONAL WRITING STANDARD — ${targetRegion}
═══════════════════════════════════════
${regionGuide}

═══════════════════════════════════════
INDUSTRY — ${targetIndustry}
═══════════════════════════════════════
Weave these keywords in naturally where truthful: ${industryKeywords}

═══════════════════════════════════════
OUTPUT FORMAT — return ONLY this JSON, no markdown, no extra text
═══════════════════════════════════════
{
  "summary": "Compelling 3-4 sentence professional summary. Tailored to ${targetRegion} conventions and ${targetIndustry} role. Hooks the reader immediately.",
  "experience": [
    {
      "company": "Exact company name from input",
      "role": "Exact job title from input",
      "location": "Location from input",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY or Present",
      "isCurrent": false,
      "bullets": [
        "Strong action verb + specific task + quantified result (STAR method)",
        "2–5 bullets per role, 1–2 lines each, metrics where possible"
      ]
    }
  ],
  "education": [
    {
      "school": "Institution name",
      "degree": "Degree type (BSc, MBA, etc.)",
      "field": "Field of study",
      "gpa": "GPA only if provided in input, else omit this key",
      "startDate": "YYYY",
      "endDate": "YYYY"
    }
  ],
  "skills": ["skill1", "skill2", "..."]
}

═══════════════════════════════════════
RULES
═══════════════════════════════════════
1. Preserve ALL facts exactly (names, companies, degrees, dates) — never invent details
2. Apply STAR method to every experience bullet: action → context → result
3. Quantify results; if only implied, prefix estimated figures with "~"
4. Add 2–3 additional ${targetIndustry}-relevant skills beyond the user's list
5. Summary must match ${targetRegion} conventions (tone, length, person)
6. Keep bullets tight — every word must earn its place

═══════════════════════════════════════
USER INPUT
═══════════════════════════════════════
${JSON.stringify(formData, null, 2)}`

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const latencyMs = Date.now() - start
    const tokensUsed = result.response.usageMetadata?.totalTokenCount ?? null

    let generated: Record<string, unknown>
    try {
      generated = JSON.parse(text)
    } catch {
      // Strip markdown fences if the model ignored responseMimeType
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      generated = JSON.parse(cleaned)
    }

    const fullContent = { personal: formData.personal, ...generated }

    // Persist to resumes table
    const { data: resume } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: formData.title?.trim() || `${formData.personal.name} — ${targetIndustry}`,
        template_id: 'modern',
        content: fullContent,
        target_region: targetRegion,
        target_industry: targetIndustry,
      })
      .select('id')
      .single()

    // Log generation
    await supabase.from('generation_logs').insert({
      user_id: user.id,
      prompt_type: 'resume_generation',
      input_data: formData,
      output_data: fullContent,
      region: targetRegion,
      industry: targetIndustry,
      model_used: 'gemini-2.0-flash',
      tokens_used: tokensUsed,
      latency_ms: latencyMs,
    })

    return NextResponse.json({ content: fullContent, resumeId: resume?.id ?? null, tokensUsed, latencyMs })
  } catch (err) {
    console.error('[resume/generate]', err)
    return NextResponse.json(
      { error: 'Failed to generate resume. Please try again.' },
      { status: 500 },
    )
  }
}
