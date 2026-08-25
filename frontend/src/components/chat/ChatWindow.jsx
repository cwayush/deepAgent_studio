import { useChatStore } from '../../store/chatStore'
import MessageBubble from './MessageBubble'
import { IconBot } from '../icons/Icons'

export default function ChatWindow() {
  const { history, isLoading } = useChatStore()

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-chat-text-muted mt-32">
        <IconBot className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg">How can I help you today?</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {history.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-chat-surface flex items-center justify-center shrink-0">
               <IconBot className="w-4 h-4 text-chat-text-muted" />
             </div>
             <div className="flex space-x-1">
               <div className="w-1.5 h-1.5 bg-chat-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-chat-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-chat-text-muted rounded-full animate-bounce"></div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
