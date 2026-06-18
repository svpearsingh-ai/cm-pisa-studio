// ตรวจสอบว่าวิทยากรที่ "ล้มเหลว" มีอยู่ในระบบแล้วจริงไหม (list users ทั้งหมดแล้วค้นหา)
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://irmofwcygxestimxydug.supabase.co'
const SERVICE_ROLE_KEY = 'sb_secret_GXAZg5k7-qrzYrj2qm1W8w_oGftjzam'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',')
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim())
    return obj
  })
}

async function main() {
  const csvText = readFileSync('./speakers.csv', 'utf-8')
  const speakers = parseCSV(csvText)
  const failedEmails = speakers.filter(s => !['11111','22222','33333','44444','55555'].some(p => s.email.startsWith(p))).map(s => s.email)

  // ดึง users ทั้งหมด (Supabase admin listUsers รองรับ pagination, page ละ 50 ปกติ, ลองดึง 1000 คน)
  let allUsers = []
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) { console.log('list error:', error); break }
    allUsers = allUsers.concat(data.users)
    if (data.users.length < 200) break
    page++
  }

  console.log(`รวม users ในระบบทั้งหมด: ${allUsers.length}`)

  for (const email of failedEmails) {
    const found = allUsers.find(u => u.email === email)
    if (found) {
      console.log(`✅ มีอยู่แล้ว: ${email} | created_at: ${found.created_at} | metadata: ${JSON.stringify(found.user_metadata)}`)
    } else {
      console.log(`❌ ไม่พบ: ${email}`)
    }
  }
}

main()
