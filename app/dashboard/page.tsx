'use client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'Sarabun,sans-serif' }}>
      {/* Topbar */}
      <div style={{ background:'#1E40AF', padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, boxShadow:'0 2px 8px rgba(30,64,175,.3)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>📚</div>
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:15, lineHeight:1 }}>CM PISA Studio</div>
            <div style={{ color:'rgba(255,255,255,.6)', fontSize:11, marginTop:2 }}>ศธจ.เชียงใหม่</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#F59E0B,#D97706)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#1E40AF', cursor:'pointer', fontSize:14 }}>ค</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:700, margin:'0 auto', padding:'60px 20px' }}>

        {/* Welcome */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📚</div>
          <h1 style={{ fontSize:28, fontWeight:700, color:'#0F172A', margin:'0 0 8px' }}>CM PISA Studio</h1>
          <p style={{ color:'#64748B', fontSize:16, margin:0 }}>ระบบผู้ช่วย AI สร้างข้อสอบและแผนการเรียนรู้ตามแนว PISA</p>
          <p style={{ color:'#94A3B8', fontSize:14, margin:'4px 0 0' }}>สำนักงานศึกษาธิการจังหวัดเชียงใหม่</p>
        </div>

        {/* 2 ปุ่มหลัก */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 }}>
          <button onClick={() => router.push('/exam')}
            style={{ background:'linear-gradient(135deg,#1E40AF,#3B82F6)', border:'none', borderRadius:16, padding:'32px 24px', cursor:'pointer', textAlign:'center', boxShadow:'0 8px 24px rgba(30,64,175,.3)', transition:'transform .15s' }}
            onMouseOver={e => (e.currentTarget.style.transform='translateY(-4px)')}
            onMouseOut={e => (e.currentTarget.style.transform='translateY(0)')}>
            <div style={{ fontSize:40, marginBottom:14 }}>📝</div>
            <div style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:6 }}>สร้างข้อสอบ PISA</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', lineHeight:1.5 }}>ปรนัย · อัตนัย · สถานการณ์<br/>พร้อมเฉลยและเหตุผล</div>
          </button>

          <button onClick={() => router.push('/lesson')}
            style={{ background:'linear-gradient(135deg,#F59E0B,#D97706)', border:'none', borderRadius:16, padding:'32px 24px', cursor:'pointer', textAlign:'center', boxShadow:'0 8px 24px rgba(245,158,11,.3)', transition:'transform .15s' }}
            onMouseOver={e => (e.currentTarget.style.transform='translateY(-4px)')}
            onMouseOut={e => (e.currentTarget.style.transform='translateY(0)')}>
            <div style={{ fontSize:40, marginBottom:14 }}>📚</div>
            <div style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:6 }}>สร้างแผนการสอน</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.9)', lineHeight:1.5 }}>ครบ 10 องค์ประกอบ<br/>Active Learning · PISA-based</div>
          </button>
        </div>

        {/* Info bar */}
        <div style={{ background:'white', borderRadius:12, padding:'16px 24px', boxShadow:'0 1px 4px rgba(0,0,0,.07)', display:'flex', justifyContent:'space-around', textAlign:'center' }}>
          {[
            { icon:'📖', label:'การอ่าน', sub:'Reading Literacy' },
            { icon:'🔢', label:'คณิตศาสตร์', sub:'Mathematical Literacy' },
            { icon:'🔬', label:'วิทยาศาสตร์', sub:'Scientific Literacy' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize:24, marginBottom:4 }}>{item.icon}</div>
              <div style={{ fontSize:14, fontWeight:600, color:'#1E40AF' }}>{item.label}</div>
              <div style={{ fontSize:11, color:'#94A3B8' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign:'center', color:'#CBD5E1', fontSize:12, marginTop:32 }}>
          AI ค้นคลังเอกสาร ศธจ.เชียงใหม่ · สอดคล้องตัวชี้วัด สพฐ.
        </p>
      </div>
    </div>
  )
}
