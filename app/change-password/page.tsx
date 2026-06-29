'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง'); return
    }
    if (newPassword.length < 6) {
      setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'); return
    }
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ทั้ง 2 ช่องไม่ตรงกัน'); return
    }

    setLoading(true)
    try {
      // ตรวจสอบรหัสผ่านเดิมโดยลอง sign in ใหม่ด้วย email + รหัสเดิม
      const { data: userData } = await supabase.auth.getUser()
      const email = userData?.user?.email
      if (!email) { setError('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่'); setLoading(false); return }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email, password: currentPassword,
      })
      if (signInError) {
        setError('รหัสผ่านเดิมไม่ถูกต้อง')
        setLoading(false)
        return
      }

      // ยืนยันรหัสเดิมถูกต้องแล้ว เปลี่ยนเป็นรหัสใหม่
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        setError('ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่')
        setLoading(false)
        return
      }

      setSuccess(true)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'Sarabun,sans-serif' }}>
      {/* Header */}
      <div style={{ background:'#1E40AF', padding:'14px 28px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/dashboard" style={{ color:'rgba(255,255,255,.7)', textDecoration:'none', fontSize:13 }}>← Dashboard</a>
        <span style={{ color:'rgba(255,255,255,.4)' }}>|</span>
        <span style={{ color:'white', fontWeight:700, fontSize:15 }}>🔑 เปลี่ยนรหัสผ่าน</span>
      </div>

      <div style={{ maxWidth:440, margin:'0 auto', padding:'48px 20px' }}>
        <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,.08)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#1E40AF,#3B82F6)', padding:'24px 28px', textAlign:'center' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🔑</div>
            <h1 style={{ color:'white', fontSize:18, fontWeight:700, margin:0 }}>เปลี่ยนรหัสผ่าน</h1>
          </div>

          <form onSubmit={handleSubmit} style={{ padding:28 }}>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:13, marginBottom:6, color:'#374151' }}>รหัสผ่านเดิม</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านปัจจุบัน"
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:13, marginBottom:6, color:'#374151' }}>รหัสผ่านใหม่</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:13, marginBottom:6, color:'#374151' }}>ยืนยันรหัสผ่านใหม่</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            {error && (
              <div style={{ marginBottom:16, padding:12, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, color:'#DC2626', fontSize:13 }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ marginBottom:16, padding:12, background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, color:'#166534', fontSize:13 }}>
                ✅ เปลี่ยนรหัสผ่านสำเร็จแล้ว
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:14, borderRadius:12, border:'none', background: loading ? '#93C5FD' : 'linear-gradient(135deg,#1E40AF,#3B82F6)', color:'white', fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
            </button>

            <button type="button" onClick={() => router.push('/dashboard')}
              style={{ width:'100%', padding:12, borderRadius:12, border:'none', background:'transparent', color:'#6B7280', fontSize:13, marginTop:12, cursor:'pointer' }}>
              ยกเลิก กลับไป Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
