import Link from 'next/link'
import Image from 'next/image'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from '@langchain/openai'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function Page() {
  const handleSubmit = async (formData: FormData) => {
    'use server'

    const url = formData.get('url') as string
    if (!url) return

    const loader = new CheerioWebBaseLoader(url, {
      selector: 'p',
    })

    const docs = await loader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const splits = await textSplitter.splitDocuments(docs)

    const langchainDocs = splits.map((doc) => {
      return new Document({
        metadata: { url },
        pageContent: doc.pageContent,
      })
    })

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small',
    })

    await SupabaseVectorStore.fromDocuments(langchainDocs.flat(), embeddings, {
      client: createClient(),
      tableName: 'documents',
      queryName: 'match_documents',
    })

    revalidatePath('/protected/documents')
  }

  const client = createClient()

  const { data, error } = await client
    .from('documents')
    .select('url: metadata->url')

  const urls = Array.from(new Set(data?.map((d) => d.url as string)).values())

  return (
    <div className='flex flex-col items-center p-12 gap-8'>
      <h2 className='text-2xl'>Documents</h2>
      <Image
        src='/images/rad-rag-loader.png'
        width={964}
        height={106}
        alt='rad-rag-loader'
        priority
      />

      <label htmlFor='url' className='form-control w-full'>
        <div className='label'>
          <span className='label-text'>Add Document:</span>
        </div>
        <form action={handleSubmit}>
          <div className='flex flex-row gap-2 w-full'>
            <input
              id='url'
              name='url'
              type='text'
              className='input input-bordered w-full'
              placeholder={'Enter URL here...'}
            />
            <input type='submit' className='btn' value='Submit' />
          </div>
        </form>
      </label>
      {urls && (
        <div className='flex flex-col gap-2 w-full'>
          <div>Loaded documents:</div>
          {urls.map((url, idx) => (
            <Link href={url} key={`url-${idx}`}>
              {url}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
