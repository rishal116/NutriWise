import { api } from "@/lib/axios/api";

export const userChatService = {
  createChat: async (otherUserId: string, context: "user" | "nutritionist") => {
    const res = await api.post("/chat/conversation", {
      otherUserId,
      context,
    });
    return res.data;
  },

  listUsers: async (context: "user" | "nutritionist") => {
    const res = await api.get("/chat/conversations", {
      params: { context },
    });
    return res.data;
  },

  getMessages: async (conversationId: string) => {
    const res = await api.get(`/chat/messages/${conversationId}`);
    return res.data;
  },

  sendMessage: async (
    conversationId: string,
    text: string,
    context: "user" | "nutritionist",
  ) => {
    const res = await api.post("/chat/message", {
      conversationId,
      text,
      messageType: "text",
      context,
    });

    return res.data;
  },

  sendFile: async (
    conversationId: string,
    file: File,
    context: "user" | "nutritionist",
  ) => {
    const formData = new FormData();

    formData.append("conversationId", conversationId);
    formData.append("file", file);
    formData.append("messageType", "file");
    formData.append("context", context); 

    const res = await api.post("/chat/message/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  markAsRead: async (conversationId: string) => {
    await api.patch(`/chat/read/${conversationId}`);
  },

  deleteMessage: async (messageId: string) => {
    await api.patch(`/chat/delete/${messageId}`);
  },

  editMessage: async (messageId: string, text: string) => {
    const res = await api.patch(`/chat/edit/${messageId}`, { text });
    return res.data;
  },
};
