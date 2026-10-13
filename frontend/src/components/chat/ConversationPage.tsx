"use client";

import { useRouter } from "next/navigation";

import ChatLayout from "./ChatLayout";
import ChatWindow from "./ChatWindow";

import type { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";

interface ConversationPageProps {
  conversation: ConversationResponseDTO;
  filter: "personal" | "group";
  messagesBasePath: "/user/messages" | "/nutritionist/messages";
}

export default function ConversationPage({
  conversation,
  filter,
  messagesBasePath,
}: ConversationPageProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(`${messagesBasePath}/${filter}`);
  };

  console.log("ConversationPage props:", {
    filter,
    messagesBasePath,
    conversationId: conversation.id,
  });

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-slate-100">
      {/* Desktop conversation sidebar */}
      <aside className="hidden h-full w-[320px] min-h-0 shrink-0 overflow-hidden md:flex lg:w-[380px]">
        <ChatLayout filter={filter} messagesBasePath={messagesBasePath} />
      </aside>

      {/* Chat panel */}
      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <ChatWindow conversation={conversation} onBack={handleBack} />
      </main>
    </div>
  );
}
