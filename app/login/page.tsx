import Login from '@/components/Login'

// Add to your login page
useEffect(() => {
  console.log('VERCEL ENV CHECK:')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  console.log('Key preview:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
}, [])
export default function LoginPage() {
  return <Login />
}
