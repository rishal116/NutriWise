"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ConversationPage from "@/components/chat/ConversationPage";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import { conversationService } from "@/services/chat/conversation.service";

export default function PersonalConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;

  const [conversation, setConversation] =
    useState<ConversationResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadConversation = async () => {
      setIsLoading(true);
      setIsInvalid(false);
      setConversation(null);

      try {
        const response =
          await conversationService.getConversationDetails(conversationId);

        if (!isMounted) return;

        if (
          !response.success ||
          !response.data ||
          response.data.chatType !== "direct"
        ) {
          setIsInvalid(true);
          return;
        }

        setConversation(response.data);
      } catch {
        if (isMounted) {
          setIsInvalid(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadConversation();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center overflow-hidden bg-slate-100">
        <p className="text-sm text-slate-500">Loading conversation...</p>
      </div>
    );
  }

  if (isInvalid || !conversation) {
    return (
      <div className="flex h-dvh items-center justify-center overflow-hidden bg-slate-100">
        <p className="text-sm text-slate-500">Invalid personal conversation.</p>
      </div>
    );
  }

  return (
    <ConversationPage
      conversation={conversation}
      filter="personal"
      messagesBasePath="/user/messages"
    />
  );
}
