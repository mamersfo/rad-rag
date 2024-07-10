'use client'

import { useCompletion } from 'ai/react'

export default function Completion() {
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
    api: '/api/completion',
  })

  const clear = () => {
    setInput('')
    setCompletion('')
  }

  return (
    <div className='flex flex-col gap-4 w-1/2 text-lg'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-row gap-2'>
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
