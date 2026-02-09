"use client";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  conversationId,
  onBack,
}: {
  conversationId: string | null;
  onBack?: () => void;
}) {
  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center max-w-sm px-6">
          <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            💬
          </div>
          <h2 className="text-2xl font-light text-gray-600">
            Select a conversation
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Choose a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Header */}
      <div className="h-14 shrink-0 px-4 border-b flex items-center justify-between bg-[#f0f2f5]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden text-lg">
              ←
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <h3 className="text-sm font-semibold">Dr. Rahul Sharma</h3>
            <p className="text-xs text-gray-500">online</p>
          </div>
        </div>
      </div>

      {/* Messages (ONLY SCROLL AREA) */}
      <div className="flex-1 overflow-y-auto wa-bg px-4 md:px-12 py-4 space-y-2">
        <div className="flex justify-center my-4">
          <span className="bg-[#e1f3fb] text-[#54656f] text-[11.5px] px-3 py-1.5 rounded-lg">
            Today
          </span>
        </div>

        <MessageBubble
          text="Hello! How can I help you?"
          isSender={false}
          timestamp="10:30 AM"
        />
        <MessageBubble
          text="I need to check my reports."
          isSender={true}
          timestamp="10:32 AM"
          status="read"
        />
        <MessageBubble
          text="Sure, let me check that for you."
          isSender={false}
          timestamp="10:33 AM"
        />
      </div>

      {/* Input (ALWAYS VISIBLE) */}
      <div className="shrink-0 bg-white border-t">
        <MessageInput />
      </div>
    </div>
  );
}
