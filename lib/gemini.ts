import { GoogleGenerativeAI } from '@google/generative-ai'
import { ExamQuestion, ExamRequest, LessonPlan, LessonRequest } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

export async function generateExam(req: ExamRequest): Promise<ExamQuestion[]> {
  const prompt = `
คุณคือผู้เชี่ยวชาญด้านการออกข้อสอบตามกรอบ PISA สำหรับนักเรียนไทย

สร้างข้อสอบ PISA:
- วิชา: ${req.subject} (${req.grade})
- ประเภท: ${req.types.join(', ')}
- บริบท: ${req.context || 'ชีวิตประจำวันของนักเรียนไทย'}
- ความยาก: ${req.difficulty || 'ปานกลาง'}
- จำนวน: ${req.count || 3} ข้อ

แต่ละข้อต้องมี:
สถานการณ์นำ, คำถาม, ตัวเลือก ก ข ค ง, เฉลย, เหตุผล, ระดับ Bloom's, สมรรถนะ PISA

ตอบเป็น JSON array เท่านั้น ห้ามมีข้อความอื่น
[
  {
    "num": 1,
    "situation": "...",
    "question": "...",
    "choices": {
      "ก": "...",
      "ข": "...",
      "ค": "...",
      "ง": "..."
    },
    "answer": "ก",
    "reason": "...",
    "bloom": "การประยุกต์",
    "pisa": "การใช้ข้อมูลในชีวิตจริง"
  }
]
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    return JSON.parse(cleaned)
  } catch {
    return [
      {
        num: 1,
        situation: 'ระบบสร้างคำตอบได้ แต่ยังแปลงเป็น JSON ไม่สำเร็จ',
        question: text,
        choices: {
          ก: '',
          ข: '',
          ค: '',
          ง: '',
        },
        answer: 'ก',
        reason: 'เหตุผล',
        bloom: 'ความรู้ความจำ',
        pisa: 'math literacy',
      },
    ]
  }
}

export async function generateLesson(req: LessonRequest): Promise<LessonPlan> {
  const prompt = `
คุณคือผู้เชี่ยวชาญด้านการจัดทำแผนการจัดการเรียนรู้ตามกรอบ PISA สำหรับครูไทย

สร้างแผนการจัดการเรียนรู้:
- วิชา: ${req.subject}
- ระดับชั้น: ${req.grade}
- หน่วยการเรียนรู้: ${req.unit}
- เวลา: ${req.duration || '1 ชั่วโมง'}
- บริบท: ${req.context || 'บริบทใกล้ตัวนักเรียน'}

ขอแผนที่มี:
1. ชื่อแผน
2. สาระสำคัญ
3. จุดประสงค์เชิงสมรรถนะ
4. สถานการณ์นำแบบ PISA
5. กิจกรรม Active Learning
6. คำถามกระตุ้นคิด
7. ใบงาน
8. การวัดและประเมินผล
9. Rubric
10. การเชื่อมโยงกรอบ PISA

ตอบเป็น JSON object เท่านั้น ห้ามมีข้อความอื่น
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    return JSON.parse(cleaned)
  } catch {
    return {
      title: 'แผนการจัดการเรียนรู้',
      content: text,
    } as LessonPlan
  }
}