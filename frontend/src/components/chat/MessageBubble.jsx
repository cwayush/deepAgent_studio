import ReactMarkdown from 'react-markdown'
import ToolCallCard from './ToolCallCard'
import { IconUser, IconBot } from '../icons/Icons'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-chat-surface border border-chat-border flex items-center justify-center">
              <IconUser className="w-5 h-5 text-chat-text-muted" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-chat-bg-main border border-chat-border flex items-center justify-center">
              <IconBot className="w-5 h-5 text-chat-text-main" />
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className={`min-w-0 ${isUser ? 'bg-chat-surface border border-chat-border px-5 py-3 rounded-2xl text-chat-text-main' : 'py-1 text-chat-text-main'}`}>
          
          {/* Main Text Content */}
          {message.text && (
            <div className={`prose prose-invert max-w-none ${message.text.startsWith('*Error:*') ? 'italic text-red-400' : ''}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}

          {/* Tool Calls (if any) */}
          {message.toolEvents && message.toolEvents.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {message.toolEvents.map((tool, idx) => (
                <ToolCallCard key={idx} tool={tool} />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
