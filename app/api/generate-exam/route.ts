// app/api/generate-exam/route.ts
// POST /api/generate-exam
// สร้างข้อสอบ PISA ด้วย Claude AI

import { NextRequest, NextResponse } from 'next/server'
import { generateExam } from '@/lib/gemini'
import { ExamRequest, ApiResponse, ExamQuestion } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as Partial<ExamRequest>

    // Validate required fields
    if (!body.subject || !body.grade) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: 'กรุณาระบุวิชา (subject) และระดับชั้น (grade)',
        code: 'MISSING_FIELDS',
      }, { status: 400 })
    }

    // Set defaults
    const examRequest: ExamRequest = {
      subject:    body.subject,
      grade:      body.grade,
      count:      body.count ?? 5,
      types:      body.types ?? ['ปรนัย', 'สถานการณ์ PISA'],
      context:    body.context ?? '',
      difficulty: body.difficulty ?? 'ปานกลาง',
      teacher_id: body.teacher_id ?? 'anonymous',
    }

    // Call Claude API
    const questions = await generateExam(examRequest)

    // TODO (Phase 3): บันทึกลง Supabase
    // const { data, error } = await supabase
    //   .from('exams')
    //   .insert({ teacher_id: examRequest.teacher_id, subject: examRequest.subject, questions })

    return NextResponse.json<ApiResponse<{ questions: ExamQuestion[] }>>({
      success: true,
      data: { questions },
    })

  } catch (error) {
    console.error('[generate-exam] Error:', error)
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างข้อสอบ',
      code: 'GENERATION_ERROR',
    }, { status: 500 })
  }
}

// Preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
