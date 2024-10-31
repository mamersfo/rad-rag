import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
    const { prompt } = await req.json()

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      prompt,
    })

    return result.toDataStreamResponse()
}