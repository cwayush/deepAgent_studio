import ModelSelector from "./ModelSelector";
import BackendSelector from "./BackendSelector";
import FeatureToggles from "./FeatureToggles";
import SystemPrompt from "./SystemPrompt";
import ThreadControls from "./ThreadControls";
import ApiKeyWarnings from "./ApiKeyWarnings";
import { IconSettings } from "../icons/Icons";

export default function Sidebar() {
  return (
    <aside className="w-80 bg-chat-bg-sidebar text-chat-text-main flex flex-col h-full overflow-hidden border-r border-chat-border rounded-r-xl z-20 shrink-0">
      <div className="p-5 border-b border-chat-border">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-chat-text-main">
          <IconSettings className="w-5 h-5 text-chat-text-muted" /> Agent config
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        <ModelSelector />
        <BackendSelector />

        <div className="pt-4 border-t border-chat-border">
          <h3 className="text-sm font-semibold text-chat-text-muted uppercase tracking-wider mb-3">
            Features
          </h3>
          <FeatureToggles />
        </div>

        <div className="pt-4 border-t border-chat-border">
          <SystemPrompt />
        </div>
      </div>

      <div className="p-5 border-t border-chat-border bg-chat-bg-main/30">
        <ThreadControls />
        <div className="mt-4">
          <ApiKeyWarnings />
        </div>
      </div>
    </aside>
  );
}
