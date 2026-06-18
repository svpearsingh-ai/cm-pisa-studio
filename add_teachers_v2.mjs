// สคริปต์เพิ่มครูเข้า Supabase Auth ทั้งหมดทีเดียว (เวอร์ชันแก้ไขล่าสุด)
// วิธีใช้: node add_teachers_v2.mjs

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
  const csvText = readFileSync('./teachers_final.csv', 'utf-8')
  const teachers = parseCSV(csvText)

  console.log(`เริ่มเพิ่มครู ${teachers.length} คน...`)

  let success = 0
  let failed = 0
  const failedList = []

  for (const t of teachers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
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
        failedList.push({ ...t, error: error.message })
      } else {
        console.log(`✅ ${t.code_name} ${t.name} (${t.email})`)
        success++
      }
    } catch (e) {
      console.log(`❌ ${t.code_name} ${t.name}: ${e.message}`)
      failed++
      failedList.push({ ...t, error: e.message })
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n=== สรุปผล ===`)
  console.log(`สำเร็จ: ${success} คน`)
  console.log(`ล้มเหลว: ${failed} คน`)

  if (failedList.length > 0) {
    console.log('\nรายชื่อที่ล้มเหลว:')
    failedList.forEach(f => console.log(`- ${f.code_name} ${f.name} (${f.email}): ${f.error}`))
  }
}

main()
