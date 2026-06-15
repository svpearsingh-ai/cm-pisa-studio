// app/dashboard/page.tsx
// Dashboard — CM PISA Studio
// เชื่อมกับ /api/stats เพื่อดึงข้อมูลจริง

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
        🏠 Dashboard
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>
        CM PISA Studio · ภาคเรียนที่ 1/2568
      </p>
      <div style={{
        padding: '24px', background: 'white', borderRadius: 12,
        border: '1px solid var(--border)', maxWidth: 500
      }}>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>
          ✅ Next.js project สร้างเสร็จแล้ว!<br/>
          📡 API Routes พร้อมใช้งาน:<br/>
          &nbsp;&nbsp;· <code>POST /api/generate-exam</code><br/>
          &nbsp;&nbsp;· <code>POST /api/generate-lesson</code><br/>
          &nbsp;&nbsp;· <code>GET /api/stats</code><br/><br/>
          ขั้นตอนถัดไป: ใส่ ANTHROPIC_API_KEY ใน .env.local
        </p>
      </div>
    </div>
  )
}
