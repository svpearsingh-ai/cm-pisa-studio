// app/page.tsx — Redirect to login
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/login')
}
