import { useConfigStore } from "../../store/chatStore";

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-sm text-chat-text-main group-hover:text-white transition-colors italic">
      {label}
    </span>
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-9 h-5 bg-chat-surface border border-chat-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-chat-text-muted after:border-transparent after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-chat-text-main peer-checked:after:bg-chat-bg-main"></div>
    </div>
  </label>
);

export default function FeatureToggles() {
  const {
    useAgentsMd,
    setUseAgentsMd,
    useSkills,
    setUseSkills,
    useSubagents,
    setUseSubagents,
  } = useConfigStore();

  return (
    <div className="space-y-4">
      <Toggle
        label="AGENTS.md"
        checked={useAgentsMd}
        onChange={setUseAgentsMd}
      />
      <Toggle label="Skills" checked={useSkills} onChange={setUseSkills} />
      <Toggle
        label="Subagents"
        checked={useSubagents}
        onChange={setUseSubagents}
      />
    </div>
  );
}
