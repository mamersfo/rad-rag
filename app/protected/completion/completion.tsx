'use client'

import { useCompletion } from 'ai/react'

export default function Completion() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: '/api/completion',
    })

  return (
    <div className='flex flex-col gap-4 w-1/2 text-lg'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-row gap-4'>
          <input
            id='input'
            type='text'
            className='input input-bordered w-full'
            name='prompt'
            value={input}
            onChange={handleInputChange}
          />
          <button className='btn' type='submit' disabled={isLoading}>
            Submit
          </button>
        </div>
      </form>
      <div>{completion}</div>
    </div>
  )
}
