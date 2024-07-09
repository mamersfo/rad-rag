import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Tabs from './tabs'

export default async function ProtectedPage({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className='p-4 flex flex-col gap-4'>
      <Header />
      <Tabs />
      <div>{children}</div>
    </div>
  )
}
