"use client";

import ConversationList from "./ConversationList";

interface ChatLayoutProps {
  filter: "all" | "personal" | "group";
  messagesBasePath: "/user/messages" | "/nutritionist/messages";
}

export default function ChatLayout({
  filter,
  messagesBasePath,
}: ChatLayoutProps) {
  console.log("ChatLayout props:", {
    filter,
    messagesBasePath,
  });

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-white">
      <aside className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <ConversationList filter={filter} messagesBasePath={messagesBasePath} />
      </aside>
    </div>
  );
}
