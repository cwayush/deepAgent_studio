import { useSessionStore, useConfigStore, useChatStore } from '../store/chatStore'
import { sendChat } from '../services/api'

export function useChat() {
  const { sessionId } = useSessionStore()
  const config = useConfigStore()
  const { appendUserMessage, appendAssistantMessage, setError, isLoading } = useChatStore()

  const sendMessage = async (message) => {
    if (!message.trim() || !sessionId || isLoading) return

    appendUserMessage(message)

    try {
      const cfg = {
        model: config.model,
        backend: config.backend,
        use_agents_md: config.useAgentsMd,
        use_skills: config.useSkills,
        use_subagents: config.useSubagents,
        system_prompt: config.systemPrompt
      }
      
      const res = await sendChat(sessionId, message, cfg)
      appendAssistantMessage(res.answer, res.tool_events, res.files)
    } catch (err) {
      setError(err.message)
    }
  }

  return { sendMessage, isLoading }
}

