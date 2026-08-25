import { useSessionStore, useConfigStore } from '../../store/chatStore'

export default function BackendSelector() {
  const { backendOptions } = useSessionStore()
  const { backend, setBackend } = useConfigStore()

  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-chat-text-main">Backend</label>
      <div className="space-y-3">
        {backendOptions.map(opt => (
          <label key={opt.value} className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input 
                type="radio" 
                name="backend" 
                value={opt.value}
                checked={backend === opt.value}
                onChange={() => setBackend(opt.value)}
                className="w-4 h-4 text-chat-text-main bg-chat-surface border-chat-border focus:ring-chat-text-muted focus:ring-1 cursor-pointer" 
              />
            </div>
            <div className="text-sm text-chat-text-muted group-hover:text-chat-text-main transition-colors leading-tight cursor-pointer">
              {opt.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
