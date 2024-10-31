import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const xai = createOpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY ?? '',
});

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await streamText({
    model: xai('grok-beta'),
    prompt,
  })

  return result.toDataStreamResponse()  
}