"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Smile, Paperclip, SendHorizontal, Loader2, X, FileIcon, Ban } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";

interface MessageInputProps {
  conversationId: string;
  isReadOnly?: boolean;
  isPlanExpired?: boolean;
  editingMessage?: MessageResponseDTO | null;
  onCancelEdit?: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onSendFile: (file: File) => Promise<void>;
  onSaveEdit?: (messageId: string, newText: string) => Promise<void>;
}

export default function MessageInput({
  isReadOnly = false,
  isPlanExpired = false,
  editingMessage,
  onCancelEdit,
  onSendMessage,
  onSendFile,
  onSaveEdit,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Populate text when editing
  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text || "");
      textareaRef.current?.focus();
    } else {
      setText("");
    }
  }, [editingMessage]);

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Revoke blob URL on unmount or when a new file replaces it
  useEffect(() => {
    return () => {
      if (filePreview && filePreview !== "file") {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const cursor = textareaRef.current?.selectionStart ?? text.length;
    const updated = text.slice(0, cursor) + emojiData.emoji + text.slice(cursor);
    setText(updated);
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursor = cursor + emojiData.emoji.length;
      textareaRef.current?.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be under 25MB");
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview("file");
    }
  };

  const clearSelectedFile = () => {
    if (filePreview && filePreview !== "file") {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetState = () => {
    setText("");
    if (filePreview && filePreview !== "file") {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setShowEmojis(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (isReadOnly || isPlanExpired || sending) return;
    if (!text.trim() && !selectedFile) return;

    setSending(true);
    try {
      if (editingMessage && onSaveEdit) {
        await onSaveEdit(editingMessage.id, text.trim());
        onCancelEdit?.();
        resetState();
      } else if (selectedFile) {
        await onSendFile(selectedFile);
        resetState();
      } else if (text.trim()) {
        await onSendMessage(text.trim());
        resetState();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (isPlanExpired) {
    return (
      <div className="p-4 bg-amber-50 border-t border-amber-200 text-center flex items-center justify-center gap-2 text-xs font-semibold text-amber-800">
        <Ban className="w-4 h-4 text-amber-600" />
        Your coaching plan has expired. Messaging is unavailable.
      </div>
    );
  }

  if (isReadOnly) {
    return (
      <div className="p-4 bg-slate-100/80 border-t border-slate-200 text-center flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <Ban className="w-4 h-4 text-slate-400" />
        This conversation is no longer active. You can still view previous messages.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-t border-slate-200/80 flex flex-col gap-2 relative">
      {/* Editing Bar */}
      {editingMessage && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs text-emerald-800">
          <span className="font-semibold">Editing message...</span>
          <button
            onClick={onCancelEdit}
            className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Selected File Preview */}
      {filePreview && (
        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {filePreview === "file" ? (
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <FileIcon className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                <Image
                  src={filePreview}
                  alt="File preview"
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                {selectedFile?.name}
              </p>
              <p className="text-[10px] text-slate-500">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={clearSelectedFile}
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Emoji & Attachment triggers */}
        <div className="flex items-center gap-1 mb-1">
          <div className="relative" ref={emojiRef}>
            {showEmojis && (
              <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.LIGHT}
                  width={300}
                  height={380}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
            <button
              onClick={() => setShowEmojis((prev) => !prev)}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              aria-label="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Textarea Input */}
        <div className="flex-1 bg-slate-100/90 border border-slate-200/70 rounded-2xl px-4 py-2 focus-within:bg-white focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none max-h-28 font-medium leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={sending || (!text.trim() && !selectedFile)}
          className={`mb-1 p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center ${
            text.trim() || selectedFile
              ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          aria-label="Send message"
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