// app/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('กรุณากรอกอีเมลและรหัสผ่าน'); return }
    setLoading(true); setError('')
    // TODO Phase 3: await supabase.auth.signInWithPassword({ email, password })
    await new Promise(r => setTimeout(r, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: '1.1fr 420px' }}>

      {/* ── Left panel ── */}
      <div className="flex flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'var(--primary)' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 50% at 100% 110%,rgba(59,130,246,.22) 0%,transparent 55%),radial-gradient(circle at 5% 80%,rgba(59,130,246,.15) 0%,transparent 40%)'
        }}/>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.065) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(135deg,transparent 0%,rgba(0,0,0,.7) 50%,rgba(0,0,0,.3) 100%)'
        }}/>

        <div className="relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ border: '1.5px solid rgba(147,197,253,.7)', background: 'rgba(59,130,246,.15)' }}>
              <svg width="24" height="24" viewBox="0 0 52 52" fill="none">
                <path d="M11 38Q11 22 26 20" stroke="#10B981" strokeWidth="2.8" strokeLinecap="round"/>
                <path d="M41 38Q41 22 26 20" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="26" y1="20" x2="26" y2="39" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="26" cy="13" r="5.5" fill="none" stroke="#EC4899" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold text-white" style={{ fontFamily: "'IBM Plex Sans Thai',sans-serif" }}>
                CM PISA Studio
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#93C5FD' }}>Chiang Mai PISA Studio</div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2.5"
            style={{ color: '#93C5FD' }}>
            <span className="block w-5 h-0.5 rounded" style={{ background: '#93C5FD' }}/>
            ระบบผู้ช่วยครู
          </div>
          <h1 className="font-bold text-white leading-snug mb-5"
            style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontFamily: "'IBM Plex Sans Thai',sans-serif" }}>
            สร้างข้อสอบและ<br/>แผนการเรียนรู้<br/>
            <em className="not-italic" style={{ color: '#FCD34D' }}>ตามแนว PISA</em>
          </h1>
          <p className="mb-10 leading-loose" style={{ color: 'rgba(255,255,255,.62)', fontSize: 15, maxWidth: 380 }}>
            AI ช่วยครูออกข้อสอบและวางแผนการสอนที่สอดคล้องกับกรอบ PISA ในเวลาไม่กี่นาที
            พร้อมระบบติดตามสำหรับนิเทศก์จังหวัดเชียงใหม่
          </p>

          {/* Feature pills */}
          {[
            { icon: '📝', title: 'สร้างข้อสอบ PISA อัตโนมัติ',      sub: 'ปรนัย · อัตนัย · สถานการณ์ · เฉลย + เกณฑ์' },
            { icon: '📚', title: 'แผนการสอนครบ 10 องค์ประกอบ',       sub: 'Active Learning · CBE · PISA-based' },
            { icon: '📊', title: 'Admin Dashboard นิเทศก์',          sub: 'สถิติรายโรงเรียน · ส่งออกรายงาน' },
          ].map(p => (
            <div key={p.title} className="flex items-center gap-3 p-3.5 rounded-xl mb-2.5 transition-colors"
              style={{ background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.1)' }}>
              <span className="text-lg w-8 text-center flex-shrink-0">{p.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white">{p.title}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.42)' }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <span className="text-2xl">🏛️</span>
          <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,.42)' }}>
            <strong style={{ color: 'rgba(255,255,255,.7)' }}>สำนักงานศึกษาธิการจังหวัดเชียงใหม่</strong><br/>
            กลุ่มนิเทศ ติดตาม และประเมินผลการจัดการศึกษา
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-col items-center justify-center bg-white px-11 py-12 relative">
        <div className="w-full max-w-xs">
          {/* Form header */}
          <div className="text-center mb-9">
            <div className="w-14 h-14 rounded-2xl inline-flex items-center justify-center mb-4"
              style={{ background: 'var(--primary)' }}>
              <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
                <path d="M11 38Q11 22 26 20" stroke="#10B981" strokeWidth="3.2" strokeLinecap="round"/>
                <path d="M41 38Q41 22 26 20" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round"/>
                <line x1="26" y1="20" x2="26" y2="39" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="26" cy="12.5" r="5.5" fill="none" stroke="#EC4899" strokeWidth="2.2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)', fontFamily: "'IBM Plex Sans Thai',sans-serif" }}>
              เข้าสู่ระบบ
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>CM PISA Studio · จังหวัดเชียงใหม่</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #A7F3D0' }}>
              👩‍🏫 ระบบสำหรับครู
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 mb-3 p-3 rounded-lg text-sm"
              style={{ background: '#FEE2E2', color: '#B91C1C' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-2)' }}>
                อีเมล หรือ เบอร์โทรศัพท์
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--text-3)' }}>✉️</span>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="teacher@school.ac.th"
                  style={{
                    width: '100%', height: 48, paddingLeft: 40, paddingRight: 14,
                    border: '1.5px solid var(--border)', borderRadius: 10,
                    fontSize: 15, fontFamily: 'inherit', background: 'var(--bg)',
                    color: 'var(--text-1)', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>
            <div className="mb-1">
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-2)' }}>
                รหัสผ่าน / รหัสครู
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--text-3)' }}>🔒</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', height: 48, paddingLeft: 40, paddingRight: 14,
                    border: '1.5px solid var(--border)', borderRadius: 10,
                    fontSize: 15, fontFamily: 'inherit', background: 'var(--bg)',
                    color: 'var(--text-1)', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>
            <div className="text-right mb-5">
              <a href="#" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>ลืมรหัสผ่าน?</a>
            </div>
            <button type="submit" disabled={loading}
              className="w-full font-bold text-base text-white transition-all flex items-center justify-center gap-2"
              style={{
                height: 50, borderRadius: 11, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#93A5C8' : 'var(--primary)', fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(30,64,175,.24)',
              }}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ →'}
            </button>
          </form>

          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }}/>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>หรือ</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }}/>
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--text-3)' }}>
            ยังไม่มีบัญชี?{' '}
            <a href="mailto:sv.pearsingh@gmail.com" className="font-semibold"
              style={{ color: 'var(--primary)' }}>
              ติดต่อผู้ดูแลระบบ
            </a>
          </p>
        </div>

        <p className="absolute bottom-5 text-xs text-center" style={{ color: 'var(--text-3)' }}>
          ติดต่อ:{' '}
          <a href="mailto:sv.pearsingh@gmail.com" style={{ color: 'var(--primary)' }}>
            sv.pearsingh@gmail.com
          </a>
          <br/>© 2568 สำนักงานศึกษาธิการจังหวัดเชียงใหม่
        </p>
      </div>
    </div>
  )
}
