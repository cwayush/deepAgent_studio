import { useChatStore } from '../../store/chatStore'
import { IconFolder } from '../icons/Icons'

export default function VirtualFilesPanel() {
  const { history } = useChatStore()
  
  // Find the last assistant message with files
  const lastAssistantMsg = [...history].reverse().find(m => m.role === 'assistant' && m.files && Object.keys(m.files).length > 0)
  const files = lastAssistantMsg ? lastAssistantMsg.files : null

  if (!files || Object.keys(files).length === 0) return null

  return (
    <div className="w-full bg-chat-surface border border-chat-border rounded-xl p-3 mb-2 flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-chat-text-muted uppercase tracking-wider mr-2">
        <IconFolder /> Workspace Files
      </div>
      {Object.keys(files).map((filename) => (
        <div 
          key={filename}
          className="text-xs bg-chat-bg-main border border-chat-border text-chat-text-main px-2.5 py-1 rounded-md flex items-center gap-1"
          title={`Size: ${files[filename].content ? files[filename].content.length : 0} chars`}
        >
          {filename}
        </div>
      ))}
    </div>
  )
}
