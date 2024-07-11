import Image from 'next/image'
import Completion from './completion'

export default async function Page() {
  return (
    <div className='flex flex-col items-center p-12 gap-8'>
      <h2 className='text-2xl'>Completion</h2>
      <Image
        src='/images/rad-rag-prompt-chain.png'
        width={594}
        height={103}
        alt='rad-rag'
        priority
      />
      <Completion />
    </div>
  )
}
