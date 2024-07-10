'use client'

import { useState } from 'react'
import { useCompletion } from 'ai/react'

export default function Completion() {
  const [endpoint, setEndpoint] = useState('/api/completion/pipe')

  const {
    completion,
    setCompletion,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: endpoint,
  })

  const clear = () => {
    setInput('')
    setCompletion('')
  }

  const apis = [
    '/api/completion/stream-openai',
    '/api/completion/pipe-openai',
    '/api/completion/pipe-ollama',
    '/api/completion/runnable-ollama',
  ]

  return (
    <div className='flex flex-col gap-4 w-1/2 text-lg'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <label htmlFor='endpoint' className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>Endpoint:</span>
          </div>
          <select
            id='endpoint'
            className='select select-bordered w-full'
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          >
            {apis.map((api, idx) => (
              <option key={`api-${idx}`} value={api}>
                {api}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor='input' className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>Prompt:</span>
          </div>
          <textarea
            id='input'
            className='textarea textarea-bordered'
            value={input}
            placeholder={'Enter prompt here...'}
            onChange={handleInputChange}
            style={{ fieldSizing: 'content' }}
          />
        </label>

        <button
          className='btn'
          type='submit'
          disabled={isLoading || input.length === 0}
        >
          Submit
        </button>
      </form>
      {error && <div className='alert alert-error'>{error.message}</div>}
      {completion && (
        <>
          <div>{completion}</div>
          <button className='btn btn-outline' onClick={clear}>
            Clear
          </button>
        </>
      )}
    </div>
  )
}
