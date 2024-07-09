import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AuthButton from '@/components/AuthButton'

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className='p-4'>
      <nav className='flex justify-between w-full'>
        <div className='text-xl font-semibold'>Rad RAG</div>
        <div className=''>
          <AuthButton />
        </div>
      </nav>
      <div>Protected</div>
    </div>
  )
}
