// app/api/stats/route.ts
// GET /api/stats
// ดึงสถิติภาพรวมสำหรับ Dashboard

import { NextResponse } from 'next/server'
import { ApiResponse, DashboardStats } from '@/types'

export async function GET() {
  try {
    // TODO (Phase 3): ดึงจาก Supabase จริง
    // const { data } = await supabase.rpc('get_dashboard_stats')

    // Mock data สำหรับ Phase 2
    const stats: DashboardStats = {
      teacher_count:    156,
      school_count:     38,
      exam_count:       1240,
      lesson_count:     284,
      monthly_exams:    118,
      monthly_lessons:  23,
      monthly_teachers: 12,
    }

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
    })

  } catch (error) {
    return NextResponse.json<ApiResponse<never>>({
      success: false,
      error: 'ไม่สามารถโหลดสถิติได้',
    }, { status: 500 })
  }
}
