// lib/anthropic.ts
// Anthropic Claude client — CM PISA Studio

import Anthropic from '@anthropic-ai/sdk'
import { ExamQuestion, ExamRequest, LessonPlan, LessonRequest } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ── สร้างข้อสอบ PISA ──────────────────────────────────
export async function generateExam(req: ExamRequest): Promise<ExamQuestion[]> {
  const prompt = `คุณคือผู้เชี่ยวชาญด้านการออกข้อสอบตามกรอบ PISA สำหรับนักเรียนไทย

สร้างข้อสอบ PISA:
- วิชา: ${req.subject} (${req.grade})
- ประเภท: ${req.types.join(', ')}
- บริบท: ${req.context || 'ชีวิตประจำวันของนักเรียนไทย'}
- ความยาก: ${req.difficulty}
- จำนวน: 3 ข้อ (ตัวอย่างตามรูปแบบที่กำหนด)

แต่ละข้อต้องมี: สถานการณ์นำ, คำถาม, ตัวเลือก ก ข ค ง, เฉลย, เหตุผล, ระดับ Bloom's, สมรรถนะ PISA

ตอบ JSON array เท่านั้น ไม่มีข้อความอื่น:
[{
  "num": 1,
  "situation": "...",
  "question": "...",
  "choices": {"ก":"...","ข":"...","ค":"...","ง":"..."},
  "answer": "ก",
  "reason": "...",
  "bloom": "การประยุกต์",
  "pisa": "การใช้ข้อมูลในชีวิตจริง"
}]`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('ไม่สามารถแปลงผลลัพธ์ได้')

  return JSON.parse(match[0]) as ExamQuestion[]
}

// ── สร้างแผนการจัดการเรียนรู้ ────────────────────────
export async function generateLesson(req: LessonRequest): Promise<LessonPlan> {
  const prompt = `คุณคือผู้เชี่ยวชาญด้านการออกแบบแผนการจัดการเรียนรู้ตามแนว PISA สำหรับครูโรงเรียนเอกชนในจังหวัดเชียงใหม่

สร้างแผนการจัดการเรียนรู้:
- วิชา: ${req.subject} ระดับ: ${req.grade}
- หน่วย: ${req.unit}
- ตัวชี้วัด: ${req.indicator || 'ตามมาตรฐาน สพฐ.'}
- เวลา: ${req.time}
- บริบท: ${req.context || 'ชีวิตจริงในท้องถิ่นเชียงใหม่'}
- รูปแบบ: ${req.methods.join(', ')}

ตอบ JSON object เท่านั้น ไม่มีข้อความอื่น:
{
  "title": "ชื่อแผนการจัดการเรียนรู้",
  "subject": "${req.subject}",
  "level": "${req.grade}",
  "time": "${req.time}",
  "core_concept": "สาระสำคัญ",
  "objectives": ["จุดประสงค์ 1","จุดประสงค์ 2","จุดประสงค์ 3"],
  "pisa_situation": "สถานการณ์นำแบบ PISA 3-4 ประโยค",
  "activities": [
    {"step":"ขั้นนำ (10 นาที)","desc":"..."},
    {"step":"ขั้นสอน (60 นาที)","desc":"กิจกรรม Active Learning"},
    {"step":"ขั้นสรุป (20 นาที)","desc":"..."}
  ],
  "guiding_questions": ["คำถาม 1","คำถาม 2","คำถาม 3"],
  "worksheet": "รายละเอียดใบงาน",
  "assessment": "การวัดและประเมินผล",
  "rubric": [
    {"level":"ดีเยี่ยม (4)","criteria":"..."},
    {"level":"ดี (3)","criteria":"..."},
    {"level":"พอใช้ (2)","criteria":"..."},
    {"level":"ต้องปรับปรุง (1)","criteria":"..."}
  ],
  "teacher_notes": "ข้อเสนอแนะสำหรับครู"
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('ไม่สามารถแปลงผลลัพธ์ได้')

  return JSON.parse(match[0]) as LessonPlan
}
