import { ChatWindow } from '@/components/ChatWindow'

export default function Page() {
  return (
    <ChatWindow
      endpoint='/api/generation'
      placeholder={'Ask me anything!'}
      titleText='Retrieval augmented chatbot'
    ></ChatWindow>
  )
}
