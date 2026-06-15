// app/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SUBJECT_CONFIG = {
  MAT: { label: 'คณิตศาสตร์', color: '#F59E0B', bg: '#FEF3C7', text: '#92400E', emoji: '🟠' },
  SCI: { label: 'วิทยาศาสตร์', color: '#10B981', bg: '#DCFCE7', text: '#166534', emoji: '🟢' },
  THA: { label: 'ภาษาไทย',    color: '#EC4899', bg: '#FCE7F3', text: '#9D174D', emoji: '🩷' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('th-TH'))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  const stats = [
    { label: 'ครูทั้งหมด',    value: '156', change: '+12', icon: '👩‍🏫', color: '#1E40AF', bg: '#DBEAFE' },
    { label: 'โรงเรียน',      value: '38',  change: '90%', icon: '🏫', color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'ข้อสอบที่สร้าง', value: '1,240', change: '+118', icon: '📝', color: '#10B981', bg: '#DCFCE7' },
    { label: 'แผนการสอน',     value: '284', change: '+23', icon: '📚', color: '#8B5CF6', bg: '#EDE9FE' },
  ]

  const recent = [
    { name: 'ครูอัมพร ใจดี',    school: 'ดาราวิทยาลัย',   subject: 'MAT', type: 'ข้อสอบ', time: '14 นาที' },
    { name: 'ครูสมชาย มีสุข',   school: 'พายัพ',          subject: 'SCI', type: 'แผนสอน', time: '32 นาที' },
    { name: 'ครูวิภา ศรีสวรรค์', school: 'มงฟอร์ต',       subject: 'THA', type: 'ข้อสอบ', time: '1 ชม.' },
    { name: 'ครูประเสริฐ วงษ์ดี', school: 'เรยีนา',       subject: 'MAT', type: 'แผนสอน', time: '3 ชม.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Sarabun, sans-serif' }}>
      {/* Topbar */}
      <div style={{ background: '#1E40AF', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, boxShadow: '0 2px 8px rgba(30,64,175,.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📚</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>CM PISA Studio</div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, marginTop: 2 }}>ศธจ.เชียงใหม่</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 13 }}>{time}</div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1E40AF', cursor: 'pointer' }}>ค</div>
        </div>
      </div>

      <div style={{ padding: '28px 28px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 }}>สวัสดี ครูเพียร์ 👋</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>ภาคเรียนที่ 1/2568 · พร้อมช่วยครูสร้างข้อสอบและแผนการสอน</p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '📝', label: 'สร้างข้อสอบ PISA', sub: 'AI ช่วยออกข้อสอบ', color: '#1E40AF', bg: '#1E40AF', path: '/exam' },
            { icon: '📚', label: 'สร้างแผนการสอน', sub: 'ครบ 10 องค์ประกอบ', color: '#92400E', bg: '#F59E0B', path: '/lesson' },
            { icon: '📊', label: 'ดูรายงาน', sub: 'สถิติรายโรงเรียน', color: '#1D4ED8', bg: '#3B82F6', path: '/admin' },
          ].map(a => (
            <button key={a.label} onClick={() => router.push(a.path)}
              style={{ background: a.bg, border: 'none', borderRadius: 14, padding: '20px 16px', cursor: 'pointer', textAlign: 'left', transition: 'transform .15s,box-shadow .15s', boxShadow: '0 4px 14px rgba(0,0,0,.15)' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.2)' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(0,0,0,.15)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 3 }}>{a.sub}</div>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.07)', borderTop: `3px solid ${s.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#94A3B8', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#10B981', marginTop: 6 }}>▲ {s.change} เดือนนี้</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Subject Legend + Recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
          {/* Recent */}
          <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>กิจกรรมล่าสุด</div>
              <span style={{ fontSize: 12, color: '#1E40AF', cursor: 'pointer', fontWeight: 600 }}>ดูทั้งหมด</span>
            </div>
            {recent.map((r, i) => {
              const s = SUBJECT_CONFIG[r.subject as keyof typeof SUBJECT_CONFIG]
              return (
                <div key={i} style={{ padding: '12px 20px', borderBottom: i < recent.length-1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{s.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{r.school} · {r.type}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.time}</div>
                </div>
              )
            })}
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Subject Legend */}
            <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>สีกลุ่มสาระ</div>
              {Object.entries(SUBJECT_CONFIG).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '8px 12px', background: v.bg, borderRadius: 9 }}>
                  <span style={{ fontSize: 16 }}>{v.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: v.text }}>{k}</span>
                  <span style={{ fontSize: 13, color: v.text }}>{v.label}</span>
                </div>
              ))}
            </div>

            {/* Status */}
            <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>สถานะระบบ</div>
              {[
                { label: 'Next.js Server', ok: true },
                { label: 'Supabase DB', ok: true },
                { label: 'Google AI API', ok: true },
                { label: 'RAG Knowledge Base', ok: true },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{s.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 100, background: '#DCFCE7', color: '#166534' }}>✓ ปกติ</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
