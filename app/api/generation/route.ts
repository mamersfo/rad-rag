import { NextRequest, NextResponse } from 'next/server'
import { LangChainAdapter, StreamingTextResponse } from 'ai'
import { createClient } from '@/utils/supabase/server'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { formatDocumentsAsString } from 'langchain/util/document'
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const messages = body.messages ?? []
    const previousMessages = messages.slice(0, -1)
    const currentMessageContent = messages[messages.length - 1].content

    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 0,
    })

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-3-small',
    })

    const client = createClient()

    const vectorstore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: 'documents',
      queryName: 'match_documents',
    })

    const retriever = vectorstore.asRetriever()

    const prompt = PromptTemplate.fromTemplate(`
      You are an assistant who answers questions about certain blog posts.

      You will find the blog posts in the context below, so please read it carefully before answering the questions.
      
      You will provide your answer based on the context and the input from the request only.

      Limit your response to 500 characters.

      <context>
        {context}
      </context>
          
      Request: {request}
      `)

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        request: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream(currentMessageContent)

    const aiStream = LangChainAdapter.toAIStream(stream)

    return new StreamingTextResponse(aiStream, {
      headers: {
        'x-message-index': (previousMessages.length + 1).toString(),
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
  }
}
