import { useState } from 'react'
import { useSessionStore, useConfigStore, useChatStore } from '../../store/chatStore'
import { sendChat } from '../../services/api'
import VirtualFilesPanel from './VirtualFilesPanel'
import { IconSend } from '../icons/Icons'

export default function ChatInput() {
  const [input, setInput] = useState('')
  const { sessionId } = useSessionStore()
  const { appendUserMessage, appendAssistantMessage, setError, isLoading } = useChatStore()
  const { model, backend, useAgentsMd, useSkills, useSubagents, systemPrompt } = useConfigStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input
    setInput('')
    appendUserMessage(userMsg)

    const config = {
      model,
      backend,
      use_agents_md: useAgentsMd,
      use_skills: useSkills,
      use_subagents: useSubagents,
      system_prompt: systemPrompt
    }

    try {
      const response = await sendChat(sessionId, userMsg, config)
      appendAssistantMessage(response.answer, response.tool_events, response.files)
    } catch (error) {
      console.error("Chat Error:", error)
      setError(error.message || 'An error occurred while communicating with the server.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Virtual Files Preview Panel */}
      <VirtualFilesPanel />

      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message DeepAgent..."
          className="w-full bg-chat-surface border border-chat-border text-chat-text-main rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-chat-text-muted resize-none max-h-48 custom-scrollbar shadow-sm"
          style={{ minHeight: '56px' }}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-3 bottom-3 p-2 bg-chat-text-main text-chat-bg-main rounded-xl hover:opacity-80 disabled:opacity-30 disabled:hover:opacity-30 transition-opacity flex items-center justify-center"
        >
          <IconSend className="w-4 h-4" />
        </button>
      </form>
      <div className="text-center text-xs text-chat-text-muted">
        AI can make mistakes. Verify important information.
      </div>
    </div>
  )
}
