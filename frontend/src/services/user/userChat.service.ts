import { api } from "@/lib/axios/api";

export const userChatService = {
  // Create or get direct chat
  createChat: async (otherUserId: string) => {
    const res = await api.post("/chat/conversation", { otherUserId });
    return res.data;
  },

  // Get all user conversations
  listUsers: async () => {
    const res = await api.get("/chat/conversations");
    return res.data;
  },

  // ✅ Get messages of a conversation
  getMessages: async (conversationId: string) => {
    const res = await api.get(`/chat/messages/${conversationId}`);
    console.log(res);
    
    return res.data;
  },

  // ✅ Send text message
  sendMessage: async (conversationId: string, text: string) => {
    const res = await api.post("/chat/message", {
      conversationId,
      text,
      messageType: "text",
    });
    return res.data;
  },

  // ✅ Send file (image / document)
  sendFile: async (conversationId: string, file: File) => {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("file", file);
    formData.append("messageType", "file");

    const res = await api.post("/chat/message/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  // ✅ Mark conversation as read
  markAsRead: async (conversationId: string) => {
    await api.patch(`/chat/read/${conversationId}`);
  },
};
