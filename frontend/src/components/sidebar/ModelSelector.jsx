import { useSessionStore, useConfigStore } from '../../store/chatStore'
import { IconChevronDown } from '../icons/Icons'

export default function ModelSelector() {
  const { modelOptions } = useSessionStore()
  const { model, setModel } = useConfigStore()

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-chat-text-main">Model</label>
      <div className="relative">
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-chat-surface border border-chat-border text-chat-text-main text-sm rounded-xl focus:ring-1 focus:ring-chat-text-muted focus:border-chat-text-muted block p-3 pr-10 outline-none appearance-none"
        >
          {modelOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-chat-text-muted">
           <IconChevronDown />
        </div>
      </div>
    </div>
  )
}
