import { NextRequest, NextResponse } from 'next/server'
import { ingestDocuments } from '@/lib/rag'

const DOCS = [
  {title:'กรอบ PISA 2025 — สมรรถนะหลัก',content:'PISA 2025 วัด 3 สมรรถนะ: Mathematical Literacy, Scientific Literacy, Reading Literacy บริบท: ส่วนตัว อาชีพ สังคม วิทยาศาสตร์',doc_type:'pisa_framework'},
  {title:'ระดับความยาก PISA 6 ระดับ',content:'ระดับ 1-2 ง่าย: ดำเนินการตามคำสั่ง ระดับ 3-4 กลาง: เชื่อมโยงหลายขั้นตอน ระดับ 5-6 ยาก: สร้างโมเดลซับซ้อน ป.4-ป.6 เน้นระดับ 1-3 ม.1-ม.3 เน้นระดับ 2-4',doc_type:'pisa_framework'},
  {title:'ตัวชี้วัด คณิตศาสตร์ ป.5',content:'ค 1.1 ป.5/1: บวก ลบ คูณ หาร เศษส่วนตัวส่วนต่าง ค 1.1 ป.5/2: ทศนิยมไม่เกิน 3 ตำแหน่ง ค 1.1 ป.5/3: อัตราส่วน ร้อยละ บริบท: ตลาด การซื้อขาย การแบ่งปัน',doc_type:'indicator',subject:'MAT',grade:'ป.5'},
  {title:'ตัวชี้วัด คณิตศาสตร์ ป.6',content:'ค 1.1 ป.6/1: เศษส่วน จำนวนคละ ทศนิยม ค 1.1 ป.6/2: ร้อยละ ค 1.2 ป.6/1: สมการเชิงเส้น ค 5.2 ป.6/1: ค่าเฉลี่ย มัธยฐาน ฐานนิยม',doc_type:'indicator',subject:'MAT',grade:'ป.6'},
  {title:'ตัวชี้วัด วิทยาศาสตร์ ป.6',content:'ว 1.1 ป.6/1: ระบบสุริยะ ดาวเคราะห์ ว 2.1 ป.6/1: สารบริสุทธิ์ สารผสม ว 4.1 ป.6/1: ทรัพยากรธรรมชาติ สิ่งแวดล้อม',doc_type:'indicator',subject:'SCI',grade:'ป.6'},
  {title:'ตัวชี้วัด ภาษาไทย ป.4',content:'ท 1.1 ป.4/1: อ่านออกเสียงถูกต้อง ท 1.1 ป.4/2: อ่านจับใจความ แยกข้อเท็จจริง ท 2.1 ป.4/1: เขียนสื่อสาร เล่าเรื่อง',doc_type:'indicator',subject:'THA',grade:'ป.4'},
  {title:'ตัวอย่างข้อสอบ PISA คณิตศาสตร์ ป.5',content:'สถานการณ์: ร้านขายผลไม้มีสับปะรด 3/4 กก. ลูกค้าซื้อ 1/3 ของที่มี ถามว่าเหลือกี่กก. เฉลย: 1/2 กก. Bloom: ประยุกต์ PISA: การใช้คณิตศาสตร์ในชีวิตจริง',doc_type:'exam_example',subject:'MAT',grade:'ป.5'},
  {title:'ตัวอย่างข้อสอบ PISA วิทยาศาสตร์ ป.6',content:'สถานการณ์: น้ำดื่มในโรงเรียน pH=6.5 มีตะกอน มาตรฐาน pH 6.5-8.5 ถามว่าดื่มได้ไหม เฉลย: pH ผ่านแต่มีตะกอนควรกรองก่อน Bloom: วิเคราะห์ PISA: แปลข้อมูลหลักฐาน',doc_type:'exam_example',subject:'SCI',grade:'ป.6'},
  {title:'ตัวอย่างแผนสอน Active Learning คณิตศาสตร์ ป.5',content:'หน่วย: เศษส่วน เวลา 2 ชั่วโมง ขั้นนำ: Think-Pair-Share สถานการณ์ตลาด ขั้นสอน: กลุ่ม 4 คน ใบงาน 3 ระดับ ขั้นสรุป: Mind Map + Exit Ticket การวัดผล: สังเกต+ใบงาน',doc_type:'plan_example',subject:'MAT',grade:'ป.5'},
  {title:'Rubric ศธจ.เชียงใหม่',content:'ระดับ 4 ดีเยี่ยม: ครบตัวชี้วัด กิจกรรมหลากหลาย PISA ระดับ 3 ดี: Active Learning ชัดเจน ระดับ 2 พอใช้: ยังเน้นครูเป็นศูนย์กลาง ระดับ 1 ปรับปรุง: ไม่สอดคล้องตัวชี้วัด',doc_type:'rubric'},
]

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) return NextResponse.json({error:'Unauthorized'},{status:401})
    const ids = await ingestDocuments(DOCS,(i,total,title)=>console.log(`[RAG] ${i}/${total}: ${title}`))
    return NextResponse.json({success:true,data:{ingested:ids.length,message:`บันทึก ${ids.length} เอกสารเข้าคลัง RAG สำเร็จ`}})
  } catch(e) {
    return NextResponse.json({success:false,error:e instanceof Error?e.message:'error'},{status:500})
  }
}

export async function GET() {
  try {
    const {createClient} = await import('@supabase/supabase-js')
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const {count} = await sb.from('documents').select('*',{count:'exact',head:true})
    return NextResponse.json({success:true,data:{total:count??0}})
  } catch(e) {
    return NextResponse.json({success:false,error:'failed'},{status:500})
  }
}
