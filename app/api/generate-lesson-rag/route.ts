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

// บันทึกสถิติการใช้งานลง usage_logs — ไม่ทำให้ request หลักพังถ้า log error
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

// บันทึกแผนการสอนเข้าตาราง lesson_plans — ไม่ทำให้ request หลักพังถ้า error
async function saveLessonRecord(token: string | null, payload: { subject: string; grade: string; unit: string; plan: any }) {
  if (!token) return
  try {
    const db = createServerClient()
    const { data: userData, error: userErr } = await db.auth.getUser(token)
    if (userErr || !userData?.user) return
    const user = userData.user

    await db.from('lesson_plans').insert({
      teacher_id: user.id,
      subject: payload.subject,
      grade: payload.grade,
      title: payload.plan?.title || payload.unit,
      plan: payload.plan,
      status: 'completed',
    })
  } catch (e) {
    console.error('save lesson record failed:', e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      subject = 'MAT', grade = 'ป.5', unit = '', indicator = '',
      time = '2 ชั่วโมง', context = '', methods = ['active_learning'], competencies = [],
    } = body

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') ?? null

    const [pisaCtx, indCtx, planCtx] = await Promise.all([
      ragQuery('PISA framework', { docType: 'pisa_framework', topK: 2 }),
      ragQuery('indicator ' + subject, { subject, grade, docType: 'indicator', topK: 2 }),
      ragQuery('plan example ' + subject, { subject, docType: 'plan_example', topK: 2 }),
    ])

    const ctx = [
      pisaCtx.contextText && `=== PISA Framework ===\n${pisaCtx.contextText}`,
      indCtx.contextText && `=== Indicators ===\n${indCtx.contextText}`,
      planCtx.contextText && `=== Examples ===\n${planCtx.contextText}`,
    ].filter(Boolean).join('\n\n')

    const methodsLabel = Array.isArray(methods) ? methods.join(', ') : methods
    const compLabel = Array.isArray(competencies) ? competencies.join(', ') : competencies

    const prompt = `You are a Thai curriculum & PISA-aligned lesson plan expert.
${ctx ? `Use this knowledge:\n${ctx}\n\n---` : ''}
Create a complete Thai lesson plan for subject: ${subject}, grade: ${grade}, unit: ${unit}, indicator: ${indicator || 'none specified'}, time: ${time}, context: ${context || 'general'}, teaching methods: ${methodsLabel}, PISA competencies emphasized: ${compLabel || 'general'}.

The lesson plan MUST include these exact fields in JSON:
- title, subject, level, time
- core_concept (string)
- objectives (array of strings — แต่ละข้อต้องเขียนให้ชัดเจน วัดผลได้ เพราะจะถูกใช้เป็นตัวหลักในการออกแบบการวัดและประเมินผลข้อ assessment_by_objective ด้านล่าง)
- indicators (array of strings)
- media_materials (array of strings — สื่อและวัสดุอุปกรณ์ที่ใช้ในการสอน เช่น ใบงาน, PowerPoint, ของจริง/ตัวอย่าง, อุปกรณ์ทดลอง, สื่อดิจิทัล ระบุให้ตรงกับกิจกรรมจริงในแผนนี้)
- pisa_situation (string)
- activities (array of {step, desc})
- guiding_questions (array of strings)
- worksheet (string)
- assessment_by_objective (array — ความยาวเท่ากับจำนวนข้อใน objectives พอดี แต่ละรายการคือ {objective, method, tool, criteria} โดย "objective" คัดลอกข้อความจาก objectives ข้อนั้นมาเป๊ะ "method" คือวิธีการวัดที่สอดคล้องกับจุดประสงค์ข้อนั้น (เช่น สังเกต, ตรวจผลงาน, ทดสอบ, สัมภาษณ์) "tool" คือเครื่องมือที่ใช้ (เช่น แบบสังเกตพฤติกรรม, แบบทดสอบ, ใบงาน, แบบประเมินชิ้นงาน) "criteria" คือเกณฑ์การผ่าน/ระดับคุณภาพสำหรับจุดประสงค์ข้อนั้นโดยเฉพาะ)
- rubric (array of {level, criteria} — 4 ระดับคุณภาพโดยรวมของทั้งแผน)
- teacher_notes (string)

Respond with JSON object only, no markdown, no code fences.`

    const text = await callGemini(prompt)
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found')

    const plan = JSON.parse(match[0])
    const sources = [...pisaCtx.sources, ...indCtx.sources, ...planCtx.sources]

    await Promise.all([
      logUsage(token, { subject, grade, topic: unit || 'ทั่วไป' }),
      saveLessonRecord(token, { subject, grade, unit, plan }),
    ])

    return NextResponse.json({
      success: true,
      data: { plan, sources, rag_used: ctx.length > 0 },
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'error',
    }, { status: 500 })
  }
}
