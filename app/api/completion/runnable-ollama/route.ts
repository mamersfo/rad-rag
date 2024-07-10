import { LangChainAdapter, StreamingTextResponse } from 'ai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatOllama } from '@langchain/community/chat_models/ollama'
import { RunnableSequence } from '@langchain/core/runnables'

export async function POST(req: Request) {
  const json = await req.json()
  
  const prompt = ChatPromptTemplate.fromTemplate(json.prompt)

  const model = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    model: 'llama3'
  })

  const outputParser = new StringOutputParser()

  const chain = RunnableSequence.from([
    prompt,
    model,
    outputParser
  ])

  const stream = await chain.stream({})

  const aiStream = LangChainAdapter.toAIStream(stream)

  return new StreamingTextResponse(aiStream)
}