'use client'

import type { Message } from 'ai/react'
import clsx from 'clsx'

export function ChatMessageBubble(props: {
  message: Message
  aiEmoji?: string
  sources?: any[]
}) {
  return (
    <div
      className={clsx(
        { 'bg-blue-100 ml-auto': props.message.role === 'user' },
        { 'bg-orange-100 text-block mr-auto': props.message.role !== 'user' },
        'rounded px-4 py-2 max-w-[80%] mb-8 flex'
      )}
    >
      <div className='whitespace-pre-wrap flex flex-col'>
        <span>{props.message.content}</span>
        {props.sources && props.sources.length ? (
          <>
            <code className='mt-4 mr-auto bg-slate-600 px-2 py-1 rounded'>
              <h2>🔍 Sources:</h2>
            </code>
            <code className='mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs'>
              {props.sources?.map((source, i) => (
                <div className='mt-2' key={'source:' + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{' '}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ))}
            </code>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
