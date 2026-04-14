"use client";

import {
  Smile,
  X,
  FileIcon,
  Loader2,
  SendHorizontal,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { userChatService } from "@/services/user/userChat.service";
import { getSocket } from "@/lib/socket";

interface MessageInputProps {
  conversationId: string;
  editingMessage?: { id: string; text: string } | null;
  onCancelEdit?: () => void;
  onMessageSent: (message: any) => void;
}

export default function MessageInput({
  conversationId,
  editingMessage,
  onCancelEdit,
  onMessageSent,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const socket = getSocket();

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [text]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleEmojiClick = (emojiData: any) => {
    const cursor = textareaRef.current?.selectionStart ?? text.length;
    const newText =
      text.slice(0, cursor) + emojiData.emoji + text.slice(cursor);
    setText(newText);
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursor = cursor + emojiData.emoji.length;
      textareaRef.current?.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert("File too large (max 20MB)");
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview("file");
    }
  };

  const resetInput = () => {
    setText("");
    setSelectedFile(null);
    setFilePreview(null);
    setShowEmojis(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!text.trim() && !selectedFile) || sending) return;
    setSending(true);
    try {
      if (editingMessage) {
        await userChatService.editMessage(editingMessage.id, text.trim());
        socket?.emit("editMessage", {
          conversationId,
          messageId: editingMessage.id,
          newText: text.trim(),
        });
        onCancelEdit?.();
        resetInput();
        return;
      }

      let newMessage;

      const context: "user" | "nutritionist" = "user"

      if (selectedFile) {
        newMessage = await userChatService.sendFile(
          conversationId,
          selectedFile,
          context,
        );
      } else {
        newMessage = await userChatService.sendMessage(
          conversationId,
          text.trim(),
          context,
        );
      }
      if (!newMessage) return;
      onMessageSent(newMessage);
      socket?.emit("sendMessage", newMessage);
      resetInput();
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border-t border-emerald-50">
      {/* EDITING INDICATOR */}
      {editingMessage && (
        <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Editing Message
            </span>
          </div>
          <button
            onClick={onCancelEdit}
            className="p-1 hover:bg-emerald-200/50 rounded-lg text-emerald-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* ACTIONS */}
        <div className="flex items-center mb-1">
          <div className="relative" ref={emojiPickerRef}>
            {showEmojis && (
              <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-emerald-100">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.LIGHT}
                  width={300}
                  height={380}
                  skinTonesDisabled
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <Smile className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* INPUT AREA */}
        <div className="flex-1 flex flex-col bg-slate-50 border border-emerald-100/50 rounded-[24px] overflow-hidden focus-within:border-emerald-300 focus-within:bg-white transition-all shadow-sm">
          {filePreview && (
            <div className="m-2 p-2 bg-white rounded-xl flex items-center justify-between border border-emerald-50 shadow-sm animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3">
                {filePreview === "file" ? (
                  <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100">
                    <FileIcon className="w-5 h-5" />
                  </div>
                ) : (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="w-12 h-12 rounded-lg object-cover border border-emerald-50"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                    {selectedFile?.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    {selectedFile?.type.split("/")[1] || "file"} •{" "}
                    {Math.round(selectedFile!.size / 1024)} KB
                  </span>
                </div>
              </div>
              <button
                onClick={resetInput}
                className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="w-full bg-transparent px-5 py-[14px] text-[15px] text-slate-700 placeholder:text-slate-400 outline-none resize-none max-h-[120px] font-medium"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        {/* SEND BUTTON */}
        <button
          onClick={handleSend}
          disabled={sending || (!text.trim() && !selectedFile)}
          className={`mb-1 p-3.5 rounded-2xl transition-all active:scale-95 shadow-lg
            ${
              text.trim() || selectedFile
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200"
                : "bg-slate-100 text-slate-300 shadow-none cursor-not-allowed"
            }`}
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
