import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  // Initialization
  sessionId: null,
  setSession: (id) => set({ sessionId: id }),

  // Options from backend
  modelOptions: [],
  backendOptions: [],
  defaultSystemPrompt: '',
  missingKeys: [],
  setConfigOptions: (data) => set({
    modelOptions: data.model_options,
    backendOptions: data.backend_options,
    defaultSystemPrompt: data.default_system_prompt,
    missingKeys: data.missing_keys,
    // Set default prompt if user hasn't modified it
    systemPrompt: useConfigStore.getState().systemPrompt || data.default_system_prompt,
  }),
}))

export const useConfigStore = create((set) => ({
  model: 'openai:gpt-5.6',
  backend: 'state',
  useAgentsMd: true,
  useSkills: true,
  useSubagents: true,
  systemPrompt: '',
  setModel: (v) => set({ model: v }),
  setBackend: (v) => set({ backend: v }),
  setUseAgentsMd: (v) => set({ useAgentsMd: v }),
  setUseSkills: (v) => set({ useSkills: v }),
  setUseSubagents: (v) => set({ useSubagents: v }),
  setSystemPrompt: (v) => set({ systemPrompt: v }),
}))

export const useChatStore = create((set) => ({
  history: [], // Array of { role: 'user'|'assistant', text: string, toolEvents: [], files: {} }
  isLoading: false,
  appendUserMessage: (text) => set((state) => ({
    history: [...state.history, { role: 'user', text, toolEvents: [], files: {} }],
    isLoading: true
  })),
  appendAssistantMessage: (text, toolEvents = [], files = {}) => set((state) => ({
    history: [...state.history, { role: 'assistant', text, toolEvents, files }],
    isLoading: false
  })),
  setError: (err) => set((state) => ({
     history: [...state.history, { role: 'assistant', text: `*Error:* ${err}`, toolEvents: [], files: {} }],
     isLoading: false
  })),
  clearHistory: () => set({ history: [], isLoading: false })
}))

