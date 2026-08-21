"use client";

import { useState } from "react";
import Image from "next/image";
import { AttachmentDTO } from "@/dtos/chat/message-response.dto";
import { MessageType } from "@/types/chat/message.types";
import { FileText, Download, X } from "lucide-react";

interface MessageAttachmentProps {
  attachments?: AttachmentDTO[];
  messageType: MessageType;
  isSender: boolean;
}

export default function MessageAttachment({
  attachments = [],
  messageType,
  isSender,
}: MessageAttachmentProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 my-1">
      {attachments.map((att, idx) => {
        if (!att.url) return null;

        const url = att.url;

        const isImage =
          messageType === MessageType.IMAGE ||
          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

        const isVideo =
          messageType === MessageType.VIDEO ||
          /\.(mp4|webm|ogg|mov)$/i.test(url);

        if (isImage) {
          return (
            <div key={url || idx} className="relative group">
              <div
                onClick={() => setSelectedImage(url)}
                className="relative rounded-xl overflow-hidden cursor-pointer w-[280px] h-60 border border-black/5 shadow-sm hover:opacity-95 transition-opacity bg-slate-900/5"
              >
                <Image
                  src={url}
                  alt={att.fileName || "Image attachment"}
                  fill
                  sizes="280px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          );
        }

        if (isVideo) {
          return (
            <div key={url || idx} className="rounded-xl overflow-hidden max-w-[300px]">
              <video
                src={url}
                controls
                className="w-full h-auto rounded-xl max-h-60 bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }

        // Default: File attachment card
        const fileSizeFormatted = att.size
          ? `${(att.size / 1024).toFixed(0)} KB`
          : "";

        return (
          <a
            key={url || idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download={att.fileName}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isSender
                ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                : "bg-slate-50 border-slate-200/60 hover:bg-slate-100 text-slate-800"
            }`}
          >
            <div
              className={`p-2.5 rounded-lg flex items-center justify-center ${
                isSender ? "bg-white/20 text-white" : "bg-emerald-500 text-white"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">
                {att.fileName || "Attached file"}
              </p>
              {fileSizeFormatted && (
                <span
                  className={`text-[10px] font-medium ${
                    isSender ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {fileSizeFormatted}
                </span>
              )}
            </div>

            <div className="p-1.5 rounded-lg">
              <Download
                className={`w-4 h-4 ${
                  isSender ? "text-white" : "text-emerald-600"
                }`}
              />
            </div>
          </a>
        );
      })}

      {/* Lightbox / Zoom Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-[85vh] flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedImage}
              alt="Zoom preview"
              fill
              sizes="90vw"
              className="object-contain rounded-lg shadow-2xl"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}