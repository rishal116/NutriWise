"use client";

import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";
import ProfileBar from "@/components/ui/profile/ProfileBar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* TOP HEADER */}
      <Header />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r">
          <ProfileBar />
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
