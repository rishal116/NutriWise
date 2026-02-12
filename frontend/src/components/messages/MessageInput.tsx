"use client";

import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { useState, useRef } from "react";
import { userChatService } from "@/services/user/userChat.service";

interface MessageInputProps {
  conversationId: string;
  onMessageSent: (message: any) => void;
}

const emojis = ["😀", "😂", "😍", "😎", "🔥", "❤️", "👍", "🙏"];

export default function MessageInput({
  conversationId,
  onMessageSent,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setSending(true);

      const newMessage = await userChatService.sendMessage(
        conversationId,
        text.trim()
      );

      onMessageSent(newMessage);
      setText("");
      setShowEmoji(false);
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedMessage = await userChatService.sendFile(
        conversationId,
        file
      );

      onMessageSent(uploadedMessage);
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-white border-t px-3 py-2">

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-3 bg-white shadow-lg rounded-xl p-3 flex gap-2 border">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setText((prev) => prev + emoji)}
              className="text-xl hover:scale-110 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">

        {/* Emoji Button */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 text-gray-500 hover:text-green-600"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment */}
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 text-gray-500 hover:text-green-600"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={handleFileUpload}
        />

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message"
          className="flex-1 resize-none border rounded-2xl px-4 py-2 text-sm outline-none max-h-32 overflow-y-auto"
        />

        {/* Send or Mic */}
        {text.trim() ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-green-500 text-white p-3 rounded-full"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button className="bg-green-500 text-white p-3 rounded-full">
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
