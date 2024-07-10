'use client'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useChat } from 'ai/react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ChatMessageBubble } from '@/components/ChatMessageBubble'
import clsx from 'clsx'

export function ChatWindow(props: {
  endpoint: string
  placeholder?: string
  titleText?: string
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null)

  const { endpoint, placeholder, titleText = 'An LLM' } = props

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({})

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources')
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, 'base64').toString('utf8'))
        : []
      const messageIndexHeader = response.headers.get('x-message-index')
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        })
      }
    },
    onError: (e) => {
      toast(e.message, {
        theme: 'dark',
      })
    },
  })

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add('grow')
    }

    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    if (chatEndpointIsLoading) {
      return
    }

    handleSubmit(e)
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden',
        { border: messages.length > 0 }
      )}
    >
      <h2 className={clsx({ hidden: messages.length > 0 }, 'text-2xl')}>
        {titleText}
      </h2>
      <div
        className='flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out'
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString()
              return (
                <ChatMessageBubble
                  key={`ChatMessageBubble-${i}`}
                  message={m}
                  sources={sourcesForMessages[sourceKey]}
                ></ChatMessageBubble>
              )
            })
          : ''}
      </div>

      <form onSubmit={sendMessage} className='flex w-full flex-col'>
        <div className='flex flex-col gap-4 w-full mt-4'>
          <textarea
            className='textarea textarea-bordered'
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
            style={{ fieldSizing: 'content' }}
          />
          <button type='submit' className='btn'>
            <div
              role='status'
              className={clsx({
                hidden: !chatEndpointIsLoading,
              })}
            >
              <span className='sr-only'>Loading...</span>
            </div>
            <span
              className={clsx({
                hidden: chatEndpointIsLoading,
              })}
            >
              Send
            </span>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}
