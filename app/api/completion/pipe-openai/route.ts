import { LangChainAdapter, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

export async function POST(req: Request) {
  const json = await req.json()
  
  const prompt = ChatPromptTemplate.fromTemplate(json.prompt)

  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0
  })

  const outputParser = new StringOutputParser()

  const chain = prompt.pipe(model).pipe(outputParser)

  const stream = await chain.stream({})

  const aiStream = LangChainAdapter.toAIStream(stream)

  return new StreamingTextResponse(aiStream)
}