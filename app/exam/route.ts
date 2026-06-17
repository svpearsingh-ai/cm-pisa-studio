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

// บันทึก log การใช้งาน — ไม่ทำให้ request หลักพังถ้า log error
async function logActivity(token: string | null, payload: { subject: string; grade: string; detail: string }) {
  if (!token) return
  try {
    const db = createServerClient()
    const { data: userData, error: userErr } = await db.auth.getUser(token)
    if (userErr || !userData?.user) return

    await db.from('activity_log').insert({
      user_id: userData.user.id,
      user_email: userData.user.email,
      action_type: 'exam',
      subject: payload.subject,
      grade: payload.grade,
      detail: payload.detail,
    })
  } catch (e) {
    console.error('log activity failed:', e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject = 'MAT', grade = 'p5', types = ['multiple choice'], context = '', difficulty = 'medium', count = 3 } = body

    // ดึง token จาก Authorization header (ส่งมาจาก frontend)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') ?? null

    const [pisaCtx, indCtx, exCtx] = await Promise.all([
      ragQuery('PISA framework', { docType: 'pisa_framework', topK: 2 }),
      ragQuery('indicator ' + subject, { subject, grade, docType: 'indicator', topK: 2 }),
      ragQuery('exam example ' + subject, { subject, docType: 'exam_example', topK: 2 }),
    ])

    const ctx = [
      pisaCtx.contextText && `=== PISA Framework ===\n${pisaCtx.contextText}`,
      indCtx.contextText && `=== Indicators ===\n${indCtx.contextText}`,
      exCtx.contextText && `=== Examples ===\n${exCtx.contextText}`,
    ].filter(Boolean).join('\n\n')

    const prompt = `You are a PISA exam expert for Thai students.
${ctx ? `Use this knowledge:\n${ctx}\n\n---` : ''}
Create ${count} PISA-style exam questions for subject: ${subject}, grade: ${grade}, context: ${context || 'daily life'}, difficulty: ${difficulty}, types requested: ${Array.isArray(types) ? types.join(', ') : types}
Respond with JSON array only, no markdown:
[{"num":1,"situation":"...","question":"...","choices":{"a":"...","b":"...","c":"...","d":"..."},"answer":"a","reason":"...","bloom":"application","pisa":"math literacy"}]`

    const text = await callGemini(prompt)
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON found')

    const questions = JSON.parse(match[0])
    const sources = [...pisaCtx.sources, ...indCtx.sources, ...exCtx.sources]

    // บันทึก log (ไม่ block response ถ้าพลาด)
    await logActivity(token, { subject, grade, detail: context || 'ทั่วไป' })

    return NextResponse.json({
      success: true,
      data: { questions, sources, rag_used: ctx.length > 0 }
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'error'
    }, { status: 500 })
  }
}
