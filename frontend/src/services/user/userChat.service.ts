import { api } from "@/lib/axios/api";

export const userChatService = {
  createChat: async (otherUserId: string) => {
    const res = await api.post("/chat/conversation", { otherUserId });
    return res.data;
  },

  listUsers: async () => {
    const res = await api.get("/chat/conversations");
    return res.data;
  },

  getMessages: async (conversationId: string) => {
    const res = await api.get(`/chat/messages/${conversationId}`);
    console.log(res);
    
    return res.data;
  },

  sendMessage: async (conversationId: string, text: string) => {
    const res = await api.post("/chat/message", {
      conversationId,
      text,
      messageType: "text",
    });
    return res.data;
  },

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

  markAsRead: async (conversationId: string) => {
    await api.patch(`/chat/read/${conversationId}`);
  },

  deleteMessage:async (message: string) => {
    await api.patch(`/chat/read/${message}`);
  },
  editMessage:async (message: string,text:string) => {
    await api.patch(`/chat/read/${message}`);
  },
};
