import { StreamingTextResponse, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {

    const json = await req.json()

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: json.prompt,
    })

    return new StreamingTextResponse(result.toAIStream())
}