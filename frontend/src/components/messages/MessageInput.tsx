"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border rounded-full px-4 py-2 outline-none text-sm"
      />
      <button className="bg-green-500 text-white p-2 rounded-full">
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}

