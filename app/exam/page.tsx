'use client'
import { useState } from 'react'

const SUBJECTS = [
  { value: 'READ', label: '📖 การอ่าน (Reading Literacy)', color: '#EC4899', bg: '#FCE7F3', text: '#9D174D' },
  { value: 'MAT',  label: '🔢 คณิตศาสตร์ (Mathematical Literacy)', color: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
  { value: 'SCI',  label: '🔬 วิทยาศาสตร์ (Scientific Literacy)', color: '#10B981', bg: '#DCFCE7', text: '#065F46' },
]

const GRADES = ['ป.4','ป.5','ป.6','ม.1','ม.2','ม.3']

const TYPES = [
  { value: 'mc4',        label: 'ปรนัย 4 ตัวเลือก',           sub: 'Multiple Choice' },
  { value: 'mc_complex', label: 'ปรนัยซับซ้อน',              sub: 'Complex Multiple Choice' },
  { value: 'situation',  label: 'สถานการณ์นำ PISA',           sub: 'Scenario-based' },
  { value: 'open_short', label: 'อัตนัยสั้น',                 sub: 'Short Constructed Response' },
  { value: 'open_long',  label: 'อัตนัยยาว / อธิบายเหตุผล',  sub: 'Open Constructed Response' },
  { value: 'true_false', label: 'ถูก/ผิดพร้อมเหตุผล',         sub: 'True/False with Reason' },
  { value: 'match',      label: 'จับคู่ข้อมูล',               sub: 'Matching' },
  { value: 'graph',      label: 'แปลความหมายกราฟ/ตาราง',      sub: 'Data Interpretation' },
]

const DIFFICULTIES = [
  { value: 'easy',   label: '⭐ ง่าย',     sub: 'PISA ระดับ 1-2' },
  { value: 'medium', label: '⭐⭐ กลาง',    sub: 'PISA ระดับ 3-4' },
  { value: 'hard',   label: '⭐⭐⭐ ยาก',   sub: 'PISA ระดับ 5-6' },
]

const CONTEXTS: Record<string, string[]> = {
  READ: [
    'บทความสิ่งแวดล้อม','นิทานพื้นบ้านล้านนา','ข่าวในชุมชน',
    'ป้ายประกาศสาธารณะ','บทกวีภาษาไทย','จดหมาย/อีเมล',
    'ตัวชี้วัด ท 1.1 ป.4','ตัวชี้วัด ท 1.1 ป.5','ตัวชี้วัด ท 1.1 ป.6',
  ],
  MAT: [
    'ตลาด/การซื้อขาย','การออมเงิน/ดอกเบี้ย','การวัดพื้นที่/ก่อสร้าง',
    'สถิติ/การสำรวจ','โภชนาการ/สุขภาพ','การเดินทาง/แผนที่',
    'ตัวชี้วัด ค 1.1 ป.5','ตัวชี้วัด ค 1.1 ป.6','ตัวชี้วัด ค 5.1 ป.5',
  ],
  SCI: [
    'น้ำดื่ม/คุณภาพน้ำ','พลังงานทดแทน','สภาพอากาศ/ภูมิอากาศ',
    'ระบบนิเวศดอยสุเทพ','สารปนเปื้อนอาหาร','สุขภาพ/โรคติดต่อ',
    'ตัวชี้วัด ว 1.1 ป.6','ตัวชี้วัด ว 2.1 ป.6','ตัวชี้วัด ว 4.1 ป.6',
  ],
}

export default function ExamPage() {
  const [subject, setSubject]     = useState('MAT')
  const [grade, setGrade]         = useState('ป.5')
  const [types, setTypes]         = useState(['mc4','situation'])
  const [difficulty, setDifficulty] = useState('medium')
  const [context, setContext]     = useState('')
  const [count, setCount]         = useState(3)
  const [loading, setLoading]     = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [sources, setSources]     = useState<string[]>([])
  const [error, setError]         = useState('')

  const toggleType = (v: string) =>
    setTypes(t => t.includes(v) ? t.filter(x => x !== v) : [...t, v])

  const handleGenerate = async () => {
    if (types.length === 0) { setError('กรุณาเลือกประเภทข้อสอบอย่างน้อย 1 ประเภท'); return }
    setLoading(true); setError(''); setQuestions([])
    try {
      const res = await fetch('/api/generate-exam-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, types, difficulty, context, count }),
      })
      const data = await res.json()
      if (data.success) { setQuestions(data.data.questions); setSources(data.data.sources) }
      else setError(data.error)
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่') }
    setLoading(false)
  }

  const sub = SUBJECTS.find(s => s.value === subject)!
  const ctxList = CONTEXTS[subject] || []

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'Sarabun,sans-serif' }}>
      {/* Header */}
      <div style={{ background:'#1E40AF', padding:'14px 28px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/dashboard" style={{ color:'rgba(255,255,255,.7)', textDecoration:'none', fontSize:13 }}>← Dashboard</a>
        <span style={{ color:'rgba(255,255,255,.4)' }}>|</span>
        <span style={{ color:'white', fontWeight:700, fontSize:15 }}>📝 สร้างข้อสอบ PISAlike</span>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,.08)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#1E40AF,#3B82F6)', padding:'24px 28px' }}>
            <h1 style={{ color:'white', fontSize:22, fontWeight:700, margin:0 }}>📝 สร้างข้อสอบ PISAlike</h1>
            <p style={{ color:'rgba(255,255,255,.75)', fontSize:14, margin:'6px 0 0' }}>AI ค้นคลังเอกสาร ศธจ.เชียงใหม่ สร้างข้อสอบสอดคล้องตัวชี้วัดและกรอบ PISA</p>
          </div>

          <div style={{ padding:28 }}>

            {/* 3 สมรรถนะ PISA */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>
                สมรรถนะ PISA (3 ด้าน)
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {SUBJECTS.map(s => (
                  <button key={s.value} onClick={() => { setSubject(s.value); setContext('') }}
                    style={{ padding:'14px 12px', borderRadius:12, border:`2px solid ${subject===s.value ? s.color : '#E5E7EB'}`, background: subject===s.value ? s.bg : 'white', cursor:'pointer', textAlign:'center', transition:'all .15s' }}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{s.label.split(' ')[0]}</div>
                    <div style={{ fontSize:13, fontWeight:700, color: subject===s.value ? s.text : '#374151' }}>{s.label.split(' ').slice(1).join(' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ระดับชั้น + จำนวน */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 200px', gap:16, marginBottom:24 }}>
              <div>
                <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>ระดับชั้น</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {GRADES.map(g => (
                    <button key={g} onClick={() => setGrade(g)}
                      style={{ padding:'8px 18px', borderRadius:10, border:`2px solid ${grade===g ? '#1E40AF' : '#E5E7EB'}`, background: grade===g ? '#DBEAFE' : 'white', fontWeight: grade===g ? 700 : 400, fontSize:14, cursor:'pointer', color: grade===g ? '#1E40AF' : '#6B7280', transition:'all .15s' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>จำนวนข้อ</label>
                <select value={count} onChange={e => setCount(Number(e.target.value))}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, background:'white' }}>
                  {[1,3,5,8,10].map(n => <option key={n} value={n}>{n} ข้อ</option>)}
                </select>
              </div>
            </div>

            {/* ประเภทข้อสอบ */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>
                ประเภทข้อสอบ PISAlike (เลือกได้หลายอย่าง)
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {TYPES.map(t => (
                  <button key={t.value} onClick={() => toggleType(t.value)}
                    style={{ padding:'10px 12px', borderRadius:10, border:`2px solid ${types.includes(t.value) ? '#10B981' : '#E5E7EB'}`, background: types.includes(t.value) ? '#DCFCE7' : 'white', cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                    <div style={{ fontSize:13, fontWeight:700, color: types.includes(t.value) ? '#065F46' : '#374151' }}>
                      {types.includes(t.value) ? '✓ ' : ''}{t.label}
                    </div>
                    <div style={{ fontSize:11, color:'#9CA3AF', marginTop:3 }}>{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ระดับความยาก */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>ระดับความยาก</label>
              <div style={{ display:'flex', gap:10 }}>
                {DIFFICULTIES.map(d => (
                  <button key={d.value} onClick={() => setDifficulty(d.value)}
                    style={{ flex:1, padding:'12px 16px', borderRadius:10, border:`2px solid ${difficulty===d.value ? '#F59E0B' : '#E5E7EB'}`, background: difficulty===d.value ? '#FEF3C7' : 'white', cursor:'pointer', textAlign:'center', transition:'all .15s' }}>
                    <div style={{ fontWeight:700, fontSize:14, color: difficulty===d.value ? '#92400E' : '#374151' }}>{d.label}</div>
                    <div style={{ fontSize:11, color:'#9CA3AF', marginTop:3 }}>{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* บริบท/สถานการณ์/ตัวชี้วัด */}
            <div style={{ marginBottom:28 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>
                บริบท / สถานการณ์ / ตัวชี้วัด (เลือกหรือพิมพ์เอง)
              </label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                {ctxList.map(c => (
                  <button key={c} onClick={() => setContext(c)}
                    style={{ padding:'6px 14px', borderRadius:20, border:`1.5px solid ${context===c ? sub.color : '#E5E7EB'}`, background: context===c ? sub.bg : 'white', fontSize:12, cursor:'pointer', color: context===c ? sub.text : '#6B7280', fontWeight: context===c ? 700 : 400, transition:'all .15s' }}>
                    {c}
                  </button>
                ))}
              </div>
              <input value={context} onChange={e => setContext(e.target.value)}
                placeholder="หรือพิมพ์บริบท ตัวชี้วัด หรือสถานการณ์เอง เช่น น้ำดื่มในโรงเรียน, ค 1.1 ป.5, ตลาดเชียงใหม่..."
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            {/* ปุ่มสร้าง */}
            <button onClick={handleGenerate} disabled={loading}
              style={{ width:'100%', padding:16, borderRadius:12, border:'none', background: loading ? '#93C5FD' : 'linear-gradient(135deg,#1E40AF,#3B82F6)', color:'white', fontSize:16, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing:'.5px' }}>
              {loading ? '⏳ AI กำลังสร้างข้อสอบ...' : `✨ สร้างข้อสอบ ${count} ข้อ`}
            </button>

            {error && <div style={{ marginTop:16, padding:14, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, color:'#DC2626', fontSize:14 }}>❌ {error}</div>}
          </div>
        </div>

        {/* ผลลัพธ์ */}
        {questions.length > 0 && (
          <div style={{ marginTop:24 }}>
            {sources.length > 0 && (
              <div style={{ background:'#DBEAFE', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:13, color:'#1E40AF' }}>
                📚 อ้างอิงจาก: {sources.slice(0,3).join(' · ')}
              </div>
            )}
            {questions.map((q, i) => (
              <div key={i} style={{ background:'white', borderRadius:14, boxShadow:'0 2px 8px rgba(0,0,0,.07)', padding:24, marginBottom:16, borderLeft:`4px solid ${sub.color}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                  <span style={{ background:sub.bg, color:sub.text, fontWeight:700, fontSize:13, padding:'3px 12px', borderRadius:20 }}>ข้อที่ {q.num}</span>
                  {q.bloom && <span style={{ background:'#F1F5F9', color:'#475569', fontSize:12, padding:'3px 10px', borderRadius:20 }}>{q.bloom}</span>}
                  {q.pisa  && <span style={{ background:'#F1F5F9', color:'#475569', fontSize:12, padding:'3px 10px', borderRadius:20 }}>{q.pisa}</span>}
                </div>
                {q.situation && <div style={{ background:'#F8FAFC', borderRadius:8, padding:'12px 14px', marginBottom:14, fontSize:14, color:'#374151', lineHeight:1.8, borderLeft:'3px solid #CBD5E1' }}>{q.situation}</div>}
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14, color:'#111827', lineHeight:1.6 }}>{q.question}</div>
                {q.choices && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                    {Object.entries(q.choices).map(([k,v]) => (
                      <div key={k} style={{ padding:'10px 14px', borderRadius:8, border:`1.5px solid ${q.answer===k ? '#10B981' : '#E5E7EB'}`, background: q.answer===k ? '#DCFCE7' : '#FAFAFA', fontSize:14 }}>
                        <span style={{ fontWeight:700, color: q.answer===k ? '#059669' : '#374151' }}>{k.toUpperCase()}. </span>
                        <span style={{ color:'#374151' }}>{v as string}</span>
                        {q.answer===k && <span style={{ float:'right', color:'#059669' }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
                {q.reason && <div style={{ background:'#F0FDF4', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#166534' }}>💡 {q.reason}</div>}
              </div>
            ))}
            <button onClick={() => window.print()}
              style={{ width:'100%', padding:14, borderRadius:12, border:'2px solid #1E40AF', background:'white', color:'#1E40AF', fontSize:15, fontWeight:700, cursor:'pointer' }}>
              🖨️ พิมพ์ข้อสอบ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
