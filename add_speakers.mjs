// สคริปต์เพิ่มวิทยากร + บัญชีสำรอง เข้า Supabase Auth
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

  console.log(`เริ่มเพิ่มวิทยากร/สำรอง ${speakers.length} คน...`)

  let success = 0, failed = 0
  const failedList = []

  for (const s of speakers) {
    try {
      const { error } = await supabase.auth.admin.createUser({
        email: s.email,
        password: s.password,
        email_confirm: true,
        user_metadata: {
          full_name: s.name,
          role: 'speaker_or_reserve',
        },
      })
      if (error) {
        console.log(`❌ ${s.name} (${s.email}): ${error.message}`)
        failed++
        failedList.push(s)
      } else {
        console.log(`✅ ${s.name} (${s.email})`)
        success++
      }
    } catch (e) {
      console.log(`❌ ${s.name}: ${e.message}`)
      failed++
      failedList.push(s)
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n=== สรุปผล ===`)
  console.log(`สำเร็จ: ${success} คน`)
  console.log(`ล้มเหลว: ${failed} คน`)
  if (failedList.length > 0) {
    console.log('รายชื่อที่ล้มเหลว:')
    failedList.forEach(s => console.log(`- ${s.name} (${s.email})`))
  }
}

main()
