// app/api/generate-lesson/route.ts
// POST /api/generate-lesson
// สร้างแผนการจัดการเรียนรู้ด้วย Claude AI

import { NextRequest, NextResponse } from 'next/server'
import { generateLesson } from '@/lib/gemini'
import { LessonRequest, ApiResponse, LessonPlan } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<LessonRequest>

    // Validate
    if (!body.subject || !body.grade || !body.unit) {
      return NextResponse.json<ApiResponse<never>>({
        success: false,
        error: 'กรุณาระบุวิชา ระดับชั้น และหน่วยการเรียนรู้',
        code: 'MISSING_FIELDS',
      }, { status: 400 })
    }

    const lessonRequest: LessonRequest = {
      subject:    body.subject,
      grade:      body.grade,
      unit:       body.unit,
      indicator:  body.indicator ?? '',
      time:       body.time ?? '2 ชั่วโมง',
      context:    body.context ?? 'ชีวิตจริงในท้องถิ่นเชียงใหม่',
      methods:    body.methods ?? ['Active Learning'],
      teacher_id: body.teacher_id ?? 'anonymous',
    }

    const plan = await generateLesson(lessonRequest)

    // TODO (Phase 3): บันทึกลง Supabase
    // const { data, error } = await supabase
    //   .from('lesson_plans')
    //   .insert({ teacher_id: lessonRequest.teacher_id, subject: lessonRequest.subject, plan })

    return NextResponse.json<ApiResponse<{ plan: LessonPlan }>>({
      success: true,
      data: { plan },
    })

  } catch (error) {
    console.error('[generate-lesson] Error:', error)
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างแผนสอน',
      code: 'GENERATION_ERROR',
    }, { status: 500 })
  }
}

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
