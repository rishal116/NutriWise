"use client";

import { useEffect, useState } from "react";

import ConversationPage from "@/components/chat/ConversationPage";
import { conversationService } from "@/services/chat/conversation.service";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";

interface GroupConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function GroupConversationPage({
  params,
}: GroupConversationPageProps) {
  const [conversation, setConversation] =
    useState<ConversationResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversation = async () => {
      const { conversationId } = await params;

      try {
        const response =
          await conversationService.getConversationDetails(conversationId);

        if (response.success && response.data) {
          setConversation(response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadConversation();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Loading conversation...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Conversation not found.</p>
      </div>
    );
  }

  if (conversation.chatType !== "group") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Invalid group conversation.</p>
      </div>
    );
  }

  return <ConversationPage
  conversation={conversation}
  filter="group"
  messagesBasePath="/user/messages"
/>
}
