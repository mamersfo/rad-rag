import AuthButton from '@/components/AuthButton'

export default async function Index() {
  return (
    <div className='p-4'>
      <nav className='flex justify-between w-full'>
        <div className='text-xl font-semibold'>Rad RAG</div>
        <div className=''>
          <AuthButton />
        </div>
      </nav>
      <main>
        <h1>Public</h1>
      </main>
    </div>
  )
}
