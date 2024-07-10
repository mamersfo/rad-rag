import Link from 'next/link'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from '@langchain/openai'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { createClient } from '@/utils/supabase/server'

/**
 *
 * See also: https://js.langchain.com/v0.2/docs/concepts/#document-loaders
 * @returns Promise<Document<Record<string, any>>[]>
 */
const loadDocuments = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url, {
    selector: 'p',
  })
  return await loader.load()
}

/**
 *
 * See also: https://js.langchain.com/v0.2/docs/concepts/#text-splitters
 * @param docs
 */
const splitDocuments = async (docs: Document<Record<string, any>>[]) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  return await textSplitter.splitDocuments(docs)
}

export default async function Page() {
  const handleSubmit = async (formData: FormData) => {
    'use server'

    const url = formData.get('url') as string
    if (!url) return

    const docs = await loadDocuments(url)
    const splits = await splitDocuments(docs)

    const langchainDocs = splits.map((doc) => {
      return new Document({
        metadata: { url },
        pageContent: doc.pageContent,
      })
    })

    await SupabaseVectorStore.fromDocuments(
      langchainDocs.flat(),
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        client: createClient(),
        tableName: 'documents',
        queryName: 'match_documents',
      }
    )
  }

  const client = createClient()

  const { data, error } = await client
    .from('documents')
    .select('url: metadata->url')

  const urls = Array.from(new Set(data?.map((d) => d.url as string)).values())

  return (
    <div className='flex flex-col items-center p-12 gap-8'>
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
