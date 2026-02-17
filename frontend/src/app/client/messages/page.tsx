"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "";
  }, [isMobile, sidebarOpen]);

  // Close sidebar when conversation selected
  useEffect(() => {
    if (isMobile && selectedConversation) setSidebarOpen(false);
  }, [selectedConversation, isMobile]);

  const handleBack = () => {
    if (isMobile) setSelectedConversation(null);
    else router.push("/client/profile");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">

      {/* Mobile Menu Button */}
      {isMobile && !selectedConversation && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-emerald-600 text-white shadow"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-white border-r transition-transform duration-300
          ${isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : "w-72"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold text-lg">Chats</span>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
        <ConversationList
          selectedId={selectedConversation}
          onSelect={setSelectedConversation}
          isMobile={isMobile}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/25 z-30"
        />
      )}

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col min-h-0 bg-white ${isMobile && !selectedConversation ? "hidden" : "flex"}`}>
        <ChatWindow conversationId={selectedConversation} onBack={handleBack} />
      </div>
    </div>
  );
}
