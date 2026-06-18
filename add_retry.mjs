// สคริปต์เพิ่มครู 9 คนที่เหลือ (เบอร์ซ้ำ แก้แล้ว)
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
  const csvText = readFileSync('./teachers_retry.csv', 'utf-8')
  const teachers = parseCSV(csvText)

  console.log(`เริ่มเพิ่มครู ${teachers.length} คน (รอบแก้เบอร์ซ้ำ)...`)

  let success = 0, failed = 0

  for (const t of teachers) {
    try {
      const { error } = await supabase.auth.admin.createUser({
        email: t.email,
        password: t.password,
        email_confirm: true,
        user_metadata: {
          code_name: t.code_name,
          full_name: `${t.title}${t.name}`,
          school: t.school,
          phone: t.phone,
        },
      })
      if (error) {
        console.log(`❌ ${t.code_name} ${t.name} (${t.email}): ${error.message}`)
        failed++
      } else {
        console.log(`✅ ${t.code_name} ${t.name} (${t.email})`)
        success++
      }
    } catch (e) {
      console.log(`❌ ${t.code_name} ${t.name}: ${e.message}`)
      failed++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n=== สรุปผล ===`)
  console.log(`สำเร็จ: ${success} คน`)
  console.log(`ล้มเหลว: ${failed} คน`)
}

main()
