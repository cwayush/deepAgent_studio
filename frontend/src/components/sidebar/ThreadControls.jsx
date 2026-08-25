import { useSessionStore, useChatStore } from '../../store/chatStore'
import { resetSession, createSession } from '../../services/api'
import { IconPlus, IconTrash } from '../icons/Icons'

export default function ThreadControls() {
  const { sessionId, setSession } = useSessionStore()
  const { clearHistory } = useChatStore()

  const handleNewThread = async () => {
    try {
      const session = await createSession()
      setSession(session.session_id)
      localStorage.setItem("deep_agent_session", session.session_id)
      clearHistory()
    } catch (err) {
      console.error(err)
      alert("Failed to create new thread.")
    }
  }

  const handleClearMemory = async () => {
    if (window.confirm("Are you sure you want to clear memory for the current thread?")) {
      try {
        await resetSession(sessionId)
        clearHistory()
      } catch (err) {
        console.error("Failed to reset session", err)
        alert("Failed to reset memory.")
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-chat-text-muted mb-2 font-mono bg-chat-surface p-2 border border-chat-border rounded-xl truncate">
        Thread: {sessionId || 'Loading...'}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleNewThread}
          className="flex-1 flex items-center justify-center gap-2 bg-chat-surface hover:bg-[#3f3f3f] border border-chat-border text-chat-text-main px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <IconPlus /> New
        </button>
        <button 
          onClick={handleClearMemory}
          className="flex-1 flex items-center justify-center gap-2 bg-chat-surface hover:bg-red-900/30 border border-chat-border hover:border-red-500/50 hover:text-red-400 text-chat-text-main px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          title="Clear memory for current thread"
        >
          <IconTrash /> Clear
        </button>
      </div>
    </div>
  )
}
