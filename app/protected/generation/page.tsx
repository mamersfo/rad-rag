import { ChatWindow } from '@/components/ChatWindow'

export default function Page() {
  return (
    <div className='flex flex-col gap-8'>
      <ChatWindow
        endpoint='/api/generation'
        placeholder={'Ask me anything!'}
        titleText='Generation'
      ></ChatWindow>
    </div>
  )
}
