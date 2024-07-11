import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

export default async function Index() {
  return (
    <div className='p-4'>
      <Header />
      <main className='flex flex-col items-center'>
        <Link href='/protected/completion'>
          <Image
            src='/images/rad-rag-tech.png'
            width={400}
            height={700}
            alt='rad-rag'
            priority
          />
        </Link>
      </main>
    </div>
  )
}
