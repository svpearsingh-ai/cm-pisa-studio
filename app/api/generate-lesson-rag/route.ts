import { NextRequest, NextResponse } from 'next/server'
import { ragQuery } from '@/lib/rag'
import { createServerClient } from '@/lib/supabase'

async function callGemini(prompt: string) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Gemini error: ${JSON.stringify(data.error)}`)
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function logUsage(token: string | null, payload: { subject: string; grade: string; topic: string }) {
  if (!token) return
  try {
    const db = createServerClient()
    const { data: userData, error: userErr } = await db.auth.getUser(token)
    if (userErr || !userData?.user) return

    const email = userData.user.email ?? ''

    await db.from('usage_logs').insert({
      teacher_id: email,
      school_name: '',
      subject: payload.subject,
      grade: payload.grade,
      action_type: 'lesson',
      topic: payload.topic,
    })
  } catch (e) {
    console.error('log usage failed:', e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      subject = 'MAT', grade = 'p5', unit = '', indicator = '',
      time = '2 ชั่วโมง', context = '', methods = ['active_learning'],
      competencies = [],
    } = body

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') ?? null

    const [pisaCtx, indCtx, planCtx, rubCtx] = await Promise.all([
      ragQuery('PISA framework ' + subject, { docType: 'pisa_framework', topK: 2 }),
      ragQuery('indicator ' + subject, { subject, grade, docType: 'indicator', topK: 2 }),
      ragQuery('lesson plan ' + subject, { subject, docType: 'lesson_plan', topK: 2 }),
      ragQuery('rubric ' + subject, { subject, docType: 'rubric', topK: 1 }),
    ])

    const ctx = [
      pisaCtx.contextText && `=== PISA Framework ===\n${pisaCtx.contextText}`,
      indCtx.contextText && `=== Indicators ===\n${indCtx.contextText}`,
      planCtx.contextText && `=== Lesson Plan Examples ===\n${planCtx.contextText}`,
      rubCtx.contextText && `=== Rubric ===\n${rubCtx.contextText}`,
    ].filter(Boolean).join('\n\n')

    const prompt = `You are an expert in designing PISA-based lesson plans for Thai teachers.
${ctx ? `Use this knowledge:\n${ctx}\n\n---` : ''}
Create a complete lesson plan:
- Subject: ${subject}, Grade: ${grade}
- Unit: ${unit}
- Indicators: ${indicator || 'standard curriculum'}
- Time: ${time}
- Context: ${context}
- Methods: ${methods.join(', ')}
- PISA competencies to emphasize: ${competencies.length > 0 ? competencies.join(', ') : 'general'}

Respond with JSON object only, no markdown:
{"title":"...","subject":"${subject}","level":"${grade}","time":"${time}","core_concept":"...","objectives":["...","...","..."],"indicators":["...","..."],"pisa_situation":"...","activities":[{"step":"Introduction","desc":"..."},{"step":"Main Activity","desc":"..."},{"step":"Summary","desc":"..."}],"guiding_questions":["...","...","..."],"worksheet":"...","assessment":"...","rubric":[{"level":"Excellent (4)","criteria":"..."},{"level":"Good (3)","criteria":"..."},{"level":"Fair (2)","criteria":"..."},{"level":"Needs Improvement (1)","criteria":"..."}],"teacher_notes":"..."}`

    const text = await callGemini(prompt)
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found')

    const plan = JSON.parse(match[0])
    const sources = [...pisaCtx.sources, ...indCtx.sources, ...planCtx.sources, ...rubCtx.sources]

    await logUsage(token, { subject, grade, topic: unit || 'ทั่วไป' })

    return NextResponse.json({ success: true, data: { plan, sources, rag_used: ctx.length > 0 } })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'error' }, { status: 500 })
  }
}
