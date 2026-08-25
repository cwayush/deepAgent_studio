import { useState } from 'react'
import { IconTool, IconChevronDown, IconChevronRight } from '../icons/Icons'

export default function ToolCallCard({ tool }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-chat-border rounded-xl overflow-hidden text-sm bg-chat-surface">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-[#3f3f3f] transition-colors"
      >
        <div className="flex items-center gap-2 text-chat-text-main font-medium">
          <IconTool className="text-chat-text-muted" />
          <span>{tool.name}</span>
        </div>
        <div className="text-chat-text-muted flex items-center gap-1">
          <span className="text-xs">
            {expanded ? 'Hide details' : 'Show details'}
          </span>
          {expanded ? <IconChevronDown /> : <IconChevronRight />}
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 py-3 border-t border-chat-border bg-chat-bg-main/50">
          <div className="mb-2">
            <span className="text-xs font-semibold text-chat-text-muted uppercase tracking-wider">Arguments</span>
            <pre className="mt-1 bg-chat-bg-main p-2 rounded-lg text-xs overflow-x-auto text-chat-text-main border border-chat-border">
              {JSON.stringify(tool.args, null, 2)}
            </pre>
          </div>
          
          {tool.result && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-chat-text-muted uppercase tracking-wider">Result</span>
              <pre className="mt-1 bg-chat-bg-main p-2 rounded-lg text-xs overflow-x-auto text-chat-text-main border border-chat-border max-h-40 custom-scrollbar">
                {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
