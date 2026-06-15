'use client'
import { useState } from 'react'

const SUBJECTS = [
  { value: 'READ', label: '📖 การอ่าน', color: '#EC4899', bg: '#FCE7F3', text: '#9D174D' },
  { value: 'MAT',  label: '🔢 คณิตศาสตร์', color: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
  { value: 'SCI',  label: '🔬 วิทยาศาสตร์', color: '#10B981', bg: '#DCFCE7', text: '#065F46' },
]

const GRADES = ['ป.4','ป.5','ป.6','ม.1','ม.2','ม.3']

const TIMES = ['1 ชั่วโมง','2 ชั่วโมง','3 ชั่วโมง','4 ชั่วโมง']

const METHODS = [
  { value: 'active_learning', label: 'Active Learning' },
  { value: 'inquiry',         label: 'Inquiry-Based Learning' },
  { value: 'pbl',             label: 'Project-Based Learning' },
  { value: 'cbe',             label: 'CBE (Competency-Based)' },
  { value: 'cooperative',     label: 'Cooperative Learning' },
  { value: 'stem',            label: 'STEM Integration' },
]

const PISA_COMPETENCIES: Record<string, string[]> = {
  READ: [
    'ดึงสารสนเทศจากข้อความ (Locate & Retrieve)',
    'แปลความหมายและบูรณาการ (Integrate & Interpret)',
    'ประเมินและสะท้อนคิด (Reflect & Evaluate)',
    'อ่านหลายแหล่ง (Multiple Sources)',
  ],
  MAT: [
    'การกำหนดปัญหา (Formulating)',
    'การใช้คณิตศาสตร์ (Employing)',
    'การแปลความหมาย (Interpreting)',
    'การให้เหตุผล (Reasoning)',
    'การสื่อสารทางคณิตศาสตร์ (Communicating)',
  ],
  SCI: [
    'อธิบายปรากฏการณ์วิทยาศาสตร์',
    'ออกแบบและประเมินการสืบเสาะ',
    'แปลความหมายข้อมูลและหลักฐาน',
    'ประเมินและออกแบบการแก้ปัญหา',
    'คิดวิพากษ์เชิงวิทยาศาสตร์',
  ],
}

const CONTEXTS: Record<string, string[]> = {
  READ: ['นิทานล้านนา','บทความสิ่งแวดล้อม','ข่าวชุมชน','ป้ายสาธารณะ','จดหมาย/อีเมล'],
  MAT:  ['ตลาด/การซื้อขาย','การออมเงิน','การวัดพื้นที่','สถิติชุมชน','โภชนาการ'],
  SCI:  ['น้ำดื่ม/คุณภาพน้ำ','พลังงานทดแทน','ระบบนิเวศ','สภาพอากาศ','สุขภาพ'],
}

export default function LessonPage() {
  const [subject, setSubject]         = useState('MAT')
  const [grade, setGrade]             = useState('ป.5')
  const [unit, setUnit]               = useState('')
  const [indicator, setIndicator]     = useState('')
  const [time, setTime]               = useState('2 ชั่วโมง')
  const [context, setContext]         = useState('')
  const [methods, setMethods]         = useState(['active_learning'])
  const [competencies, setCompetencies] = useState<string[]>([])
  const [loading, setLoading]         = useState(false)
  const [plan, setPlan]               = useState<any>(null)
  const [sources, setSources]         = useState<string[]>([])
  const [error, setError]             = useState('')

  const toggleMethod = (v: string) =>
    setMethods(m => m.includes(v) ? m.filter(x => x !== v) : [...m, v])
  const toggleComp = (v: string) =>
    setCompetencies(c => c.includes(v) ? c.filter(x => x !== v) : [...c, v])

  const sub = SUBJECTS.find(s => s.value === subject)!

  const handleGenerate = async () => {
    if (!unit.trim()) { setError('กรุณาใส่หน่วยการเรียนรู้'); return }
    setLoading(true); setError(''); setPlan(null)
    try {
      const res = await fetch('/api/generate-lesson-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, unit, indicator, time, context, methods, competencies }),
      })
      const data = await res.json()
      if (data.success) { setPlan(data.data.plan); setSources(data.data.sources) }
      else setError(data.error)
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'Sarabun,sans-serif' }}>
      {/* Header */}
      <div style={{ background:'#1E40AF', padding:'14px 28px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/dashboard" style={{ color:'rgba(255,255,255,.7)', textDecoration:'none', fontSize:13 }}>← Dashboard</a>
        <span style={{ color:'rgba(255,255,255,.4)' }}>|</span>
        <span style={{ color:'white', fontWeight:700, fontSize:15 }}>📚 สร้างแผนการจัดการเรียนรู้</span>
      </div>

      <div style={{ maxWidth:920, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,.08)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#1E40AF,#3B82F6)', padding:'24px 28px' }}>
            <h1 style={{ color:'white', fontSize:22, fontWeight:700, margin:0 }}>📚 สร้างแผนการจัดการเรียนรู้ตามแนว PISA</h1>
            <p style={{ color:'rgba(255,255,255,.75)', fontSize:14, margin:'6px 0 0' }}>ครบ 10 องค์ประกอบ · สอดคล้องตัวชี้วัด สพฐ. · บูรณาการสมรรถนะ PISA</p>
          </div>

          <div style={{ padding:28 }}>

            {/* 3 สมรรถนะ PISA */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>สมรรถนะ PISA (3 ด้าน)</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {SUBJECTS.map(s => (
                  <button key={s.value} onClick={() => { setSubject(s.value); setContext(''); setCompetencies([]) }}
                    style={{ padding:'14px 12px', borderRadius:12, border:`2px solid ${subject===s.value ? s.color : '#E5E7EB'}`, background: subject===s.value ? s.bg : 'white', cursor:'pointer', textAlign:'center', transition:'all .15s' }}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{s.label.split(' ')[0]}</div>
                    <div style={{ fontSize:13, fontWeight:700, color: subject===s.value ? s.text : '#374151' }}>{s.label.split(' ').slice(1).join(' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ระดับชั้น + เวลา */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 200px', gap:16, marginBottom:24 }}>
              <div>
                <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>ระดับชั้น</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {GRADES.map(g => (
                    <button key={g} onClick={() => setGrade(g)}
                      style={{ padding:'8px 18px', borderRadius:10, border:`2px solid ${grade===g ? '#1E40AF' : '#E5E7EB'}`, background: grade===g ? '#DBEAFE' : 'white', fontWeight: grade===g ? 700 : 400, fontSize:14, cursor:'pointer', color: grade===g ? '#1E40AF' : '#6B7280' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>เวลาเรียน</label>
                <select value={time} onChange={e => setTime(e.target.value)}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, background:'white' }}>
                  {TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* หน่วยการเรียนรู้ + ตัวชี้วัด */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
              <div>
                <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:8, color:'#374151' }}>หน่วยการเรียนรู้ *</label>
                <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="เช่น เศษส่วน, ระบบสุริยะ, การอ่านจับใจความ"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:8, color:'#374151' }}>ตัวชี้วัด</label>
                <input value={indicator} onChange={e => setIndicator(e.target.value)} placeholder="เช่น ค 1.1 ป.5/1, ว 1.1 ป.6/2"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            </div>

            {/* สมรรถนะ PISA ที่เน้น */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>
                สมรรถนะ PISA ที่เน้น (เลือกได้หลายอย่าง)
              </label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(PISA_COMPETENCIES[subject] || []).map(c => (
                  <button key={c} onClick={() => toggleComp(c)}
                    style={{ padding:'8px 14px', borderRadius:10, border:`2px solid ${competencies.includes(c) ? sub.color : '#E5E7EB'}`, background: competencies.includes(c) ? sub.bg : 'white', fontSize:13, cursor:'pointer', fontWeight: competencies.includes(c) ? 700 : 400, color: competencies.includes(c) ? sub.text : '#6B7280', transition:'all .15s' }}>
                    {competencies.includes(c) ? '✓ ' : ''}{c}
                  </button>
                ))}
              </div>
            </div>

            {/* วิธีสอน */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>รูปแบบการสอน (เลือกได้หลายอย่าง)</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {METHODS.map(m => (
                  <button key={m.value} onClick={() => toggleMethod(m.value)}
                    style={{ padding:'10px 14px', borderRadius:10, border:`2px solid ${methods.includes(m.value) ? '#8B5CF6' : '#E5E7EB'}`, background: methods.includes(m.value) ? '#EDE9FE' : 'white', fontSize:13, cursor:'pointer', fontWeight: methods.includes(m.value) ? 700 : 400, color: methods.includes(m.value) ? '#5B21B6' : '#6B7280', transition:'all .15s', textAlign:'left' }}>
                    {methods.includes(m.value) ? '✓ ' : ''}{m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* บริบท */}
            <div style={{ marginBottom:28 }}>
              <label style={{ display:'block', fontWeight:700, fontSize:14, marginBottom:10, color:'#374151' }}>บริบท / สถานการณ์ / ตัวชี้วัด (เลือกหรือพิมพ์เอง)</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                {(CONTEXTS[subject] || []).map(c => (
                  <button key={c} onClick={() => setContext(c)}
                    style={{ padding:'6px 14px', borderRadius:20, border:`1.5px solid ${context===c ? sub.color : '#E5E7EB'}`, background: context===c ? sub.bg : 'white', fontSize:12, cursor:'pointer', color: context===c ? sub.text : '#6B7280', fontWeight: context===c ? 700 : 400 }}>
                    {c}
                  </button>
                ))}
              </div>
              <input value={context} onChange={e => setContext(e.target.value)}
                placeholder="หรือพิมพ์บริบทเอง เช่น ตลาดวโรรส เชียงใหม่, น้ำดื่มในโรงเรียน..."
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>

            {/* ปุ่ม */}
            <button onClick={handleGenerate} disabled={loading}
              style={{ width:'100%', padding:16, borderRadius:12, border:'none', background: loading ? '#93C5FD' : 'linear-gradient(135deg,#1E40AF,#3B82F6)', color:'white', fontSize:16, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ AI กำลังสร้างแผนการสอน...' : '✨ สร้างแผนการจัดการเรียนรู้'}
            </button>

            {error && <div style={{ marginTop:16, padding:14, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, color:'#DC2626', fontSize:14 }}>❌ {error}</div>}
          </div>
        </div>

        {/* ผลลัพธ์ */}
        {plan && (
          <div style={{ marginTop:24 }}>
            {sources.length > 0 && (
              <div style={{ background:'#DBEAFE', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:13, color:'#1E40AF' }}>
                📚 อ้างอิงจาก: {sources.slice(0,3).join(' · ')}
              </div>
            )}

            <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,.08)', overflow:'hidden' }}>
              {/* หัวแผน */}
              <div style={{ background:`linear-gradient(135deg,${sub.color},${sub.color}cc)`, padding:'20px 28px' }}>
                <h2 style={{ color:'white', fontSize:20, fontWeight:700, margin:0 }}>{plan.title}</h2>
                <div style={{ color:'rgba(255,255,255,.8)', fontSize:13, marginTop:8, display:'flex', gap:20 }}>
                  <span>📚 {plan.subject}</span>
                  <span>🎓 {plan.level}</span>
                  <span>⏱️ {plan.time}</span>
                </div>
              </div>

              <div style={{ padding:28 }}>
                {/* สาระสำคัญ */}
                <Section title="1. สาระสำคัญ" color={sub.color}>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.8, color:'#374151' }}>{plan.core_concept}</p>
                </Section>

                {/* จุดประสงค์ */}
                <Section title="2. จุดประสงค์การเรียนรู้" color={sub.color}>
                  {plan.objectives?.map((o: string, i: number) => (
                    <div key={i} style={{ display:'flex', gap:10, marginBottom:8 }}>
                      <span style={{ background:sub.bg, color:sub.text, fontWeight:700, fontSize:12, padding:'2px 9px', borderRadius:20, flexShrink:0 }}>{i+1}</span>
                      <span style={{ fontSize:14, color:'#374151', lineHeight:1.7 }}>{o}</span>
                    </div>
                  ))}
                </Section>

                {/* ตัวชี้วัด */}
                {plan.indicators && (
                  <Section title="3. มาตรฐาน/ตัวชี้วัด" color={sub.color}>
                    {plan.indicators.map((ind: string, i: number) => (
                      <div key={i} style={{ fontSize:14, color:'#374151', padding:'4px 0', borderBottom:'1px solid #F1F5F9' }}>🎯 {ind}</div>
                    ))}
                  </Section>
                )}

                {/* สถานการณ์นำ PISA */}
                <Section title="4. สถานการณ์นำแบบ PISA" color={sub.color}>
                  <div style={{ background:'#F8FAFC', borderRadius:10, padding:'14px 16px', fontSize:14, lineHeight:1.9, color:'#374151', borderLeft:`4px solid ${sub.color}` }}>
                    {plan.pisa_situation}
                  </div>
                </Section>

                {/* กิจกรรม */}
                <Section title="5. กิจกรรมการเรียนรู้" color={sub.color}>
                  {plan.activities?.map((a: any, i: number) => (
                    <div key={i} style={{ marginBottom:14, padding:'14px 16px', background:'#F8FAFC', borderRadius:10 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:sub.text, marginBottom:8 }}>{a.step}</div>
                      <div style={{ fontSize:14, color:'#374151', lineHeight:1.8 }}>{a.desc}</div>
                    </div>
                  ))}
                </Section>

                {/* คำถามกระตุ้น */}
                <Section title="6. คำถามกระตุ้นการคิด" color={sub.color}>
                  {plan.guiding_questions?.map((q: string, i: number) => (
                    <div key={i} style={{ display:'flex', gap:10, marginBottom:8 }}>
                      <span style={{ color:sub.color, fontWeight:700 }}>Q{i+1}.</span>
                      <span style={{ fontSize:14, color:'#374151', lineHeight:1.7 }}>{q}</span>
                    </div>
                  ))}
                </Section>

                {/* ใบงาน */}
                <Section title="7. ชิ้นงาน/ใบงาน" color={sub.color}>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.8, color:'#374151' }}>{plan.worksheet}</p>
                </Section>

                {/* การวัดผล */}
                <Section title="8. การวัดและประเมินผล" color={sub.color}>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.8, color:'#374151' }}>{plan.assessment}</p>
                </Section>

                {/* Rubric */}
                {plan.rubric && (
                  <Section title="9. เกณฑ์การประเมิน (Rubric)" color={sub.color}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                      {plan.rubric.map((r: any, i: number) => (
                        <div key={i} style={{ padding:'12px 14px', borderRadius:10, background: i===0 ? '#DCFCE7' : i===1 ? '#DBEAFE' : i===2 ? '#FEF3C7' : '#FEE2E2', border:`1px solid ${i===0 ? '#A7F3D0' : i===1 ? '#BFDBFE' : i===2 ? '#FDE68A' : '#FECACA'}` }}>
                          <div style={{ fontWeight:700, fontSize:13, marginBottom:6, color: i===0 ? '#166534' : i===1 ? '#1D4ED8' : i===2 ? '#92400E' : '#991B1B' }}>{r.level}</div>
                          <div style={{ fontSize:12, color:'#374151', lineHeight:1.6 }}>{r.criteria}</div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* หมายเหตุครู */}
                {plan.teacher_notes && (
                  <Section title="10. ข้อเสนอแนะสำหรับครู" color={sub.color}>
                    <div style={{ background:'#FFFBEB', borderRadius:10, padding:'14px 16px', fontSize:14, lineHeight:1.8, color:'#92400E', border:'1px solid #FDE68A' }}>
                      💡 {plan.teacher_notes}
                    </div>
                  </Section>
                )}
              </div>
            </div>

            <button onClick={() => window.print()}
              style={{ width:'100%', padding:14, borderRadius:12, border:'2px solid #1E40AF', background:'white', color:'#1E40AF', fontSize:15, fontWeight:700, cursor:'pointer', marginTop:16 }}>
              🖨️ พิมพ์แผนการสอน
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ width:4, height:20, borderRadius:4, background:color }} />
        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:'#111827' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}
