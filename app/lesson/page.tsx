'use client'

import { useState } from 'react'

export default function LessonPage() {
  const [subject, setSubject] = useState('วิทยาศาสตร์')
  const [grade, setGrade] = useState('ป.5')
  const [unit, setUnit] = useState('น้ำและสิ่งแวดล้อม')
  const [time, setTime] = useState('1 ชั่วโมง')
  const [context, setContext] = useState('น้ำดื่มในโรงเรียนและการดูแลสุขภาพของนักเรียน')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function generateLesson() {
    setLoading(true)
    setResult('')

    await new Promise((r) => setTimeout(r, 1000))

    setResult(`
แผนการจัดการเรียนรู้ตามแนว PISA

วิชา: ${subject}
ระดับชั้น: ${grade}
หน่วยการเรียนรู้: ${unit}
เวลาเรียน: ${time}

บริบทสถานการณ์:
${context}

1. สาระสำคัญ
ผู้เรียนเรียนรู้จากสถานการณ์จริงใกล้ตัว โดยใช้ข้อมูล หลักฐาน และเหตุผลในการวิเคราะห์ปัญหา และเสนอแนวทางแก้ไขที่เหมาะสม

2. จุดประสงค์เชิงสมรรถนะ
เมื่อจบบทเรียน นักเรียนสามารถ
1) อ่านและทำความเข้าใจสถานการณ์ที่กำหนดได้
2) วิเคราะห์ข้อมูลจากสถานการณ์จริงได้
3) อธิบายเหตุผลโดยใช้หลักฐานประกอบคำตอบได้
4) เสนอแนวทางแก้ปัญหาอย่างเหมาะสม

3. สถานการณ์นำแบบ PISA
โรงเรียนพบว่านักเรียนบางคนไม่มั่นใจว่าน้ำดื่มจากจุดบริการในโรงเรียนสะอาดเพียงพอ นักเรียนจึงต้องช่วยกันสังเกต รวบรวมข้อมูล และเสนอแนวทางดูแลคุณภาพน้ำดื่มในโรงเรียน

4. กิจกรรมการเรียนรู้แบบ Active Learning

ขั้นที่ 1 กระตุ้นคิด
ครูนำเสนอภาพหรือสถานการณ์เกี่ยวกับน้ำดื่มในโรงเรียน แล้วตั้งคำถามว่า
“เราจะรู้ได้อย่างไรว่าน้ำดื่มปลอดภัย?”

ขั้นที่ 2 สำรวจและรวบรวมข้อมูล
นักเรียนทำงานกลุ่ม วิเคราะห์ข้อมูลจากสถานการณ์ เช่น สี กลิ่น จุดบริการน้ำ และผลการตรวจเบื้องต้น

ขั้นที่ 3 วิเคราะห์และอภิปราย
นักเรียนอภิปรายว่า ข้อมูลใดสำคัญที่สุด และใช้หลักฐานใดสนับสนุนคำตอบ

ขั้นที่ 4 สรุปและนำเสนอ
แต่ละกลุ่มนำเสนอแนวทางดูแลคุณภาพน้ำดื่มในโรงเรียน

ขั้นที่ 5 สะท้อนคิด
นักเรียนเขียนสรุปว่า สิ่งที่เรียนรู้นำไปใช้ในชีวิตประจำวันได้อย่างไร

5. คำถามกระตุ้นคิด
- ข้อมูลใดจำเป็นที่สุดในการตัดสินใจ
- นักเรียนใช้หลักฐานใดสนับสนุนคำตอบ
- ถ้าข้อมูลไม่ครบถ้วน ควรทำอย่างไร
- แนวทางใดทำได้จริงในโรงเรียนของเรา

6. สื่อและแหล่งเรียนรู้
- ภาพสถานการณ์น้ำดื่มในโรงเรียน
- ใบงานวิเคราะห์ข้อมูล
- ตารางบันทึกข้อมูล
- ข้อมูลจากบริบทจริงในโรงเรียน

7. การวัดและประเมินผล
- ตรวจใบงานวิเคราะห์สถานการณ์
- สังเกตการอภิปรายกลุ่ม
- ประเมินการนำเสนอ
- ประเมินการเขียนเหตุผลประกอบคำตอบ

8. Rubric การประเมิน

ระดับ 3 ดีมาก:
วิเคราะห์ข้อมูลได้ถูกต้อง ใช้หลักฐานชัดเจน และอธิบายเหตุผลได้สมเหตุสมผล

ระดับ 2 ดี:
วิเคราะห์ข้อมูลได้บางส่วน มีเหตุผลประกอบ แต่หลักฐานยังไม่ครบถ้วน

ระดับ 1 พอใช้:
ตอบคำถามได้ แต่ยังอธิบายเหตุผลไม่ชัดเจน

ระดับ 0 ควรพัฒนา:
ยังไม่สามารถใช้ข้อมูลหรือหลักฐานประกอบคำตอบได้

9. การเชื่อมโยงกรอบ PISA
- การอ่านและตีความข้อมูลจากสถานการณ์จริง
- การใช้เหตุผลจากหลักฐาน
- การแก้ปัญหาในบริบทชีวิตประจำวัน
- การสื่อสารคำตอบอย่างมีเหตุผล
    `)

    setLoading(false)
  }

  return (
    <main style={{ padding: 40, fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        📚 สร้างแผนการจัดการเรียนรู้
      </h1>

      <p style={{ color: '#64748b' }}>
        CM PISA Studio | สร้างแผน Active Learning ตามแนว PISA
      </p>

      <div
        style={{
          marginTop: 24,
          background: 'white',
          padding: 24,
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          maxWidth: 760,
        }}
      >
        <label>วิชา</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 16 }}
        >
          <option>ภาษาไทย</option>
          <option>คณิตศาสตร์</option>
          <option>วิทยาศาสตร์</option>
        </select>

        <label>ระดับชั้น</label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 16 }}
        >
          <option>ป.4</option>
          <option>ป.5</option>
          <option>ป.6</option>
        </select>

        <label>หน่วยการเรียนรู้</label>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 16 }}
        />

        <label>เวลาเรียน</label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 16 }}
        >
          <option>1 ชั่วโมง</option>
          <option>2 ชั่วโมง</option>
          <option>3 ชั่วโมง</option>
        </select>

        <label>บริบทสถานการณ์</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 16,
            minHeight: 90,
          }}
        />

        <button
          onClick={generateLesson}
          disabled={loading}
          style={{
            background: '#1E40AF',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          {loading ? 'กำลังสร้างแผน...' : 'สร้างแผนการจัดการเรียนรู้'}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 24,
            background: '#f8fafc',
            padding: 24,
            borderRadius: 16,
            border: '1px solid #cbd5e1',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            maxWidth: 950,
          }}
        >
          {result}
        </div>
      )}
    </main>
  )
}