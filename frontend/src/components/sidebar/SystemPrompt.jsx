import { useConfigStore } from "../../store/chatStore";
import { useState } from "react";

const PROMPT_PRESETS = [
  {
    label: "Default Researcher",
    value:
      "You are an expert AI assistant and researcher. You conduct thorough research using your internet_search tool when needed, plan multi-step work with write_todos, offload bulky content to files, use your skills when a query matches one, and delegate deep-dive research to your subagents. Always cite sources when research was involved.",
  },
  {
    label: "Code Expert",
    value:
      "You are an elite software engineer. Prioritize writing clean, optimized, and modern code. Do not explain basics unless asked. Provide complete files when doing refactors.",
  },
  {
    label: "Creative Writer",
    value:
      "You are a creative writer and storyteller. Use vivid, descriptive language and imaginative formatting to answer prompts.",
  },
  { label: "Custom (Manual)", value: "" },
];

export default function SystemPrompt() {
  const { systemPrompt, setSystemPrompt } = useConfigStore();
  const [selectedPreset, setSelectedPreset] = useState(PROMPT_PRESETS[0].label);

  const handlePresetChange = (e) => {
    const val = e.target.value;
    setSelectedPreset(val);
    const preset = PROMPT_PRESETS.find((p) => p.label === val);
    if (preset && preset.value !== "") {
      setSystemPrompt(preset.value);
    }
  };

  const handleManualChange = (e) => {
    setSystemPrompt(e.target.value);
    setSelectedPreset("Custom (Manual)");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-chat-text-main">
        System prompt
      </label>

      <select
        value={selectedPreset}
        onChange={handlePresetChange}
        className="w-full  bg-chat-surface border border-chat-border text-chat-text-main text-xs rounded-xl focus:ring-1 focus:ring-chat-text-muted focus:border-chat-text-muted block p-3 outline-none mb-1 appearance-none"
      >
        {PROMPT_PRESETS.map((p) => (
          <option key={p.label} value={p.label}>
            {p.label}
          </option>
        ))}
      </select>

      <textarea
        rows={6}
        value={systemPrompt}
        onChange={handleManualChange}
        placeholder="Type a custom system prompt..."
        className="w-full bg-chat-surface border border-chat-border text-chat-text-main text-xs rounded-xl focus:ring-1 focus:ring-chat-text-muted focus:border-chat-text-muted block p-3 outline-none resize-y"
      />
    </div>
  );
}
