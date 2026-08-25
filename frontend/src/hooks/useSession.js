import { useSessionStore, useChatStore } from '../store/chatStore'
import { newThread, resetSession } from '../services/api'

export function useSession() {
  const { sessionId } = useSessionStore()
  const { clearHistory } = useChatStore()

  const handleNewThread = async () => {
    if (!sessionId) return
    try {
      await newThread(sessionId)
      clearHistory()
    } catch (err) {
      console.error(err)
    }
  }

  const handleResetAll = async () => {
    if (!sessionId) return
    try {
      await resetSession(sessionId)
      clearHistory()
    } catch (err) {
      console.error(err)
    }
  }

  return { handleNewThread, handleResetAll }
}

