"use client";
import { CheckCheck } from "lucide-react";

export default function MessageBubble({
  text,
  isSender,
  timestamp,
  status = "read",
}: {
  text: string;
  isSender: boolean;
  timestamp: string;
  status?: string;
}) {
  return (
    <div className={`flex w-full mb-1 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[85%] md:max-w-[70%] px-3 py-1.5 shadow-sm 
        ${isSender 
          ? "bg-[#dcf8c6] text-[#303030] rounded-l-lg rounded-br-lg rounded-tr-none" 
          : "bg-white text-[#303030] rounded-r-lg rounded-bl-lg rounded-tl-none"}
      `}
      >
        {/* The Bubble Tail */}
        <div className={`absolute top-0 w-2 h-2.5 
          ${isSender 
            ? "-right-2 bg-[#dcf8c6] [clip-path:polygon(0_0,0_100%,100%_0)]" 
            : "-left-2 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]"}
        `} />

        <div className="flex flex-wrap items-end gap-2">
          <span className="text-[14.5px] leading-relaxed pb-1">{text}</span>
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <span className="text-[10px] text-gray-500 mb-[-2px]">
              {timestamp}
            </span>
            {isSender && (
              <CheckCheck className={`w-3.5 h-3.5 ${status === 'read' ? 'text-blue-400' : 'text-gray-400'}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}