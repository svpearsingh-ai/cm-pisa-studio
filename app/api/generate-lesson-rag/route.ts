import { NextRequest, NextResponse } from 'next/server'
import { ragQuery } from '@/lib/rag'

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY!
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  })
  if (!res.ok) throw new Error('Gemini error: ' + await res.text())
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject='MAT', grade='p5', unit='', indicator='', time='2 hours', context='Chiangmai', methods=['Active Learning'] } = body
    if (!unit) return NextResponse.json({ success: false, error: 'Please provide unit' }, { status: 400 })

    const [pisaCtx, indCtx, planCtx, rubCtx] = await Promise.all([
      ragQuery('PISA framework', { docType: 'pisa_framework', topK: 2 }),
      ragQuery('indicator ' + subject, { subject, grade, docType: 'indicator', topK: 2 }),
      ragQuery('lesson plan ' + subject, { subject, docType: 'plan_example', topK: 2 }),
      ragQuery('rubric assessment', { docType: 'rubric', topK: 1 }),
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

Respond with JSON object only, no markdown:
{"title":"...","subject":"${subject}","level":"${grade}","time":"${time}","core_concept":"...","objectives":["...","...","..."],"pisa_situation":"...","activities":[{"step":"Introduction","desc":"..."},{"step":"Main Activity","desc":"..."},{"step":"Summary","desc":"..."}],"guiding_questions":["...","...","..."],"worksheet":"...","assessment":"...","rubric":[{"level":"Excellent (4)","criteria":"..."},{"level":"Good (3)","criteria":"..."},{"level":"Fair (2)","criteria":"..."},{"level":"Needs Improvement (1)","criteria":"..."}],"teacher_notes":"..."}`

    const text = await callGemini(prompt)
    const clean = text.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim()
    const match = clean.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found')

    const plan = JSON.parse(match[0])
    const sources = [...pisaCtx.sources, ...indCtx.sources, ...planCtx.sources, ...rubCtx.sources]

    return NextResponse.json({ success: true, data: { plan, sources, rag_used: ctx.length > 0 } })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'error' }, { status: 500 })
  }
}
