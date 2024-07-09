import AuthButton from './AuthButton'

export default function Header() {
  return (
    <nav className='flex justify-between w-full'>
      <div className='text-xl font-semibold'>Rad RAG</div>
      <div className=''>
        <AuthButton />
      </div>
    </nav>
  )
}
