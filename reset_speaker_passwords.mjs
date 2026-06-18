// รีเซ็ต password ของวิทยากร 11 คนที่มีอยู่แล้วในระบบ ให้เป็น 123456 และเติม metadata ให้ครบ
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
  // เฉพาะ 11 คนที่เคยมีอยู่แล้ว (ไม่รวมสำรอง 5 คนที่สร้างสำเร็จไปแล้ว)
  const reserveEmails = ['11111@cmpisastudio.com','22222@cmpisastudio.com','33333@cmpisastudio.com','44444@cmpisastudio.com','55555@cmpisastudio.com']
  const targets = speakers.filter(s => !reserveEmails.includes(s.email))

  console.log(`เริ่มรีเซ็ต password ${targets.length} คน...`)

  // ดึง users ทั้งหมดเพื่อหา user id จาก email
  let allUsers = []
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) { console.log('list error:', error); break }
    allUsers = allUsers.concat(data.users)
    if (data.users.length < 200) break
    page++
  }

  let success = 0, failed = 0

  for (const s of targets) {
    const user = allUsers.find(u => u.email === s.email)
    if (!user) {
      console.log(`❌ ไม่พบ user: ${s.email}`)
      failed++
      continue
    }
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: s.password,
      user_metadata: { full_name: s.name, role: 'speaker_or_reserve' },
    })
    if (error) {
      console.log(`❌ ${s.name} (${s.email}): ${error.message}`)
      failed++
    } else {
      console.log(`✅ รีเซ็ตแล้ว: ${s.name} (${s.email}) -> password: ${s.password}`)
      success++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n=== สรุปผล ===`)
  console.log(`สำเร็จ: ${success} คน`)
  console.log(`ล้มเหลว: ${failed} คน`)
}

main()
