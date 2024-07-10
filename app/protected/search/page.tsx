import Link from 'next/link'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  console.log('searchParams:', searchParams)

  const handleSubmit = async (formData: FormData) => {
    'use server'

    const keywords = formData.get('keywords') as string
    if (!keywords) return

    redirect(`/protected/search?q=${keywords}`)
  }

  let found = []

  if (searchParams && searchParams['q']) {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small',
    })

    const result = await embeddings.embedDocuments([
      searchParams['q'] as string,
    ])

    const query_embedding = result[0]

    const supabase = createClient()

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding,
      match_count: 10,
    })

    if (error) {
      console.error('error:', error)
    } else {
      found = data
    }
  }

  const urls: string[] = []

  return (
    <div className='flex flex-col items-center p-12 gap-8'>
      <label htmlFor='url' className='form-control w-full'>
        <div className='label'>
          <span className='label-text'>Search:</span>
        </div>
        <form action={handleSubmit}>
          <div className='flex flex-row gap-2 w-full'>
            <input
              id='keywords'
              name='keywords'
              type='text'
              className='input input-bordered w-full'
              placeholder={'Enter search terms here...'}
            />
            <input type='submit' className='btn' value='Submit' />
          </div>
        </form>
      </label>
      {found && found.length > 0 && (
        <div className='flex flex-col gap-4 w-full'>
          <div>Found:</div>
          {found.map((f: any, idx: number) => (
            <div className='flex flex-col gap-2'>
              <Link
                className='font-semibold underline'
                href={f.metadata.url}
                key={`url-${idx}`}
              >
                {f.metadata.url}
              </Link>
              <div className='text-sm'>{f.content}</div>
              <div className='text-sm text-blue-500'>
                Similarity: {f.similarity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
