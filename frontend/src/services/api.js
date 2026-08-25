const API_BASE = '/api' // Proxy handles host

export async function fetchConfigOptions() {
  const res = await fetch(`${API_BASE}/config/options`)
  if (!res.ok) throw new Error('Failed to fetch config options')
  return res.json()
}

export async function createSession() {
  const res = await fetch(`${API_BASE}/session`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to create session')
  return res.json()
}

export async function newThread(sessionId) {
  const res = await fetch(`${API_BASE}/session/${sessionId}/new-thread`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to create new thread')
  return res.json()
}

export async function resetSession(sessionId) {
  const res = await fetch(`${API_BASE}/session/${sessionId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to reset session')
  return res.json()
}

export async function sendChat(sessionId, message, config) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message, config }),
  })
  if (!res.ok) {
     const text = await res.text()
    //  throw new Error(`Chat failed: ${text}`)
    // const text = await res.text()
    let data;
    try {
      data = JSON.parse(text)
      let detail = data.detail || text
      
      if (res.status === 404 && typeof detail === 'string' && detail.includes('not found')) {
        localStorage.removeItem('deep_agent_session')
        detail = 'Session expired (server restarted). Please refresh the page or click New Thread.'
      }

      // Try to parse inner stringified JSON from deepagents/langchain
      if (typeof detail === 'string' && detail.includes("{'error':")) {
        const match = detail.match(/'message':\s*'([^']+)'/)
        if (match && match[1]) {
           detail = match[1]
        }
      }
      throw new Error(detail)
    } catch(e) {
      if (e.message !== text && (!data || e.message !== data.detail)) {
         throw e // re-throw our parsed error
      }
      throw new Error(text)
    }
  }
  return res.json()
}

