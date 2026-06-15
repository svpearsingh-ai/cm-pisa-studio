'use client'

import { useState } from 'react'

export default function ExamPage() {
  const [subject, setSubject] = useState('วิทยาศาสตร์')
  const [grade, setGrade] = useState('ป.5')
  const [topic, setTopic] = useState('น้ำสะอาด')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

 async function generateExam() {
  setLoading(true)
  setResult('')

  try {
    const res = await fetch('/api/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        grade,
        count: 5,
        types: ['ปรนัย', 'สถานการณ์ PISA'],
        context: topic,
        difficulty: 'ปานกลาง',
        teacher_id: 'anonymous',
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setResult(data.error || 'เกิดข้อผิดพลาด')
      return
    }

    setResult(JSON.stringify(data, null, 2))
  } catch (error) {
    setResult('เชื่อมต่อ API ไม่สำเร็จ')
  } finally {
    setLoading(false)
  }
}

  return (
    <main style={{ padding: 40, fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        📝 AI สร้างข้อสอบ
      </h1>

      <p style={{ color: '#64748b' }}>
        CM PISA Studio | สร้างข้อสอบตามแนว PISA
      </p>

      <div style={{
        marginTop: 24,
        background: 'white',
        padding: 24,
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        maxWidth: 720
      }}>
        <label>วิชา</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 16 }}>
          <option>ภาษาไทย</option>
          <option>คณิตศาสตร์</option>
          <option>วิทยาศาสตร์</option>
        </select>

        <label>ระดับชั้น</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 16 }}>
          <option>ป.4</option>
          <option>ป.5</option>
          <option>ป.6</option>
        </select>

        <label>หัวข้อ / เรื่อง</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 16 }}
        />

        <button
          onClick={generateExam}
          disabled={loading}
          style={{
            background: '#1E40AF',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 12,
            fontWeight: 700
          }}
        >
          {loading ? 'กำลังสร้างข้อสอบ...' : 'สร้างข้อสอบ'}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: 24,
          background: '#f8fafc',
          padding: 24,
          borderRadius: 16,
          border: '1px solid #cbd5e1',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.8,
          maxWidth: 900
        }}>
          {result}
        </div>
      )}
    </main>
  )
}