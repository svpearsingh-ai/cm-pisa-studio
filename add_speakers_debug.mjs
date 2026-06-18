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

  // ทดสอบแค่คนแรกที่ล้มเหลว เพื่อดู error เต็มๆ
  const test = speakers.find(s => s.email === '0987386317@cmpisastudio.com')
  console.log('ทดสอบ:', test)

  const { data, error } = await supabase.auth.admin.createUser({
    email: test.email,
    password: test.password,
    email_confirm: true,
    user_metadata: { full_name: test.name, role: 'speaker_or_reserve' },
  })

  console.log('--- ผลลัพธ์เต็ม ---')
  console.log('data:', JSON.stringify(data, null, 2))
  console.log('error:', JSON.stringify(error, null, 2))
}

main()
