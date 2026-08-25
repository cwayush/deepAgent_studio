import { IconBot } from "../icons/Icons";

export default function Header() {
  return (
    <header className="bg-chat-bg-main px-6 py-4 flex items-center z-10 sticky top-0">
      <div className="flex items-center gap-3 text-chat-text-main">
        <IconBot className="w-6 h-6 text-chat-text-muted" />
        <div>
          <h1 className="text-xl font-bold text-chat-text-main leading-none mb-1">
            DeepAgent Studio
          </h1>
          <p className="text-xs text-chat-text-muted max-w-2xl truncate">
            Planning | Virtual FS | AGENTS.md | Skills | Subagents | Backends |
            Thread Memory
          </p>
        </div>
      </div>
    </header>
  );
}
