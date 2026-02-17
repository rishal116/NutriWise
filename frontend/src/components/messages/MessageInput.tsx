"use client";

import { Send, Paperclip, Smile, X, FileIcon, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { userChatService } from "@/services/user/userChat.service";
import { getSocket } from "@/lib/socket";

interface MessageInputProps {
  conversationId: string;
  onMessageSent: (message: any) => void;
}

export default function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTyping = () => {
    socket?.emit("typing", { conversationId, isTyping: text.length > 0 });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    // Keep focus on textarea after picking an emoji
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview("file");
    }
  };

  const handleSend = async () => {
    if ((!text.trim() && !selectedFile) || sending) return;
    setSending(true);
    try {
      let newMessage;
      if (selectedFile) {
        newMessage = await userChatService.sendFile(conversationId, selectedFile);
      } else {
        newMessage = await userChatService.sendMessage(conversationId, text.trim());
      }
      onMessageSent(newMessage);
      socket?.emit("sendMessage", { conversationId, ...newMessage });
      socket?.emit("typing", { conversationId, isTyping: false });
      setText("");
      setSelectedFile(null);
      setFilePreview(null);
      setShowEmojis(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white p-4 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Full Emoji Picker Popover */}
        {showEmojis && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-20 left-4 z-50 shadow-2xl border border-gray-100 rounded-xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <EmojiPicker 
              onEmojiClick={onEmojiClick}
              autoFocusSearch={false}
              theme={Theme.LIGHT}
              width={320}
              height={400}
              searchPlaceholder="Search emoji..."
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
            />
          </div>
        )}

        {/* File Preview */}
        {filePreview && (
          <div className="mb-3 flex items-center animate-in fade-in slide-in-from-bottom-2">
            <div className="relative group rounded-xl border border-emerald-100 bg-emerald-50/30 p-2">
              {filePreview === "file" ? (
                <div className="flex items-center gap-2 px-2 py-1">
                  <FileIcon className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-medium text-gray-600 truncate max-w-[150px]">{selectedFile?.name}</span>
                </div>
              ) : (
                <img src={filePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg shadow-sm" />
              )}
              <button 
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                className="absolute -top-2 -right-2 bg-white text-gray-500 rounded-full p-1 shadow-md border border-gray-100 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex items-center self-center mb-1">
            <button 
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-2.5 rounded-full transition-all ${showEmojis ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50'}`}
            >
              <Smile className="w-5 h-5" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50 rounded-full transition-all"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-emerald-500/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => { setText(e.target.value); handleTyping(); }}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Write a message..."
              className="w-full bg-transparent px-4 py-3 text-[15px] outline-none resize-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedFile) || sending}
            className={`flex-shrink-0 p-3 rounded-full transition-all duration-300 mb-1 ${
              (text.trim() || selectedFile) && !sending
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}