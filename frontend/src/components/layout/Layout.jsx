import Header from "./Header";
import Sidebar from "../sidebar/Sidebar";
import ChatWindow from "../chat/ChatWindow";
import ChatInput from "../chat/ChatInput";

export default function Layout() {
  return (
    <div className="flex h-screen bg-chat-bg-main text-chat-text-main font-sans selection:bg-chat-surface selection:text-white">
      {/* Sidebar - fixed width */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Chat Area - Scrollable */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <ChatWindow />
          </div>
        </main>

        {/* Input Area - Fixed Bottom */}
        <div className="bg-transparent pb-6 pt-2 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
