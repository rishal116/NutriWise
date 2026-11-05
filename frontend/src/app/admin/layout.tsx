
"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminThemeProvider from "@/components/providers/AdminThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminThemeProvider>
      <div
        id="admin-dashboard"
        className="flex min-h-screen flex-col bg-admin-bg"
      >
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        <div className="flex min-h-0 flex-1">
          <AdminSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <main className="min-w-0 flex-1 px-4 pb-10 pt-8 md:px-8">
            <div className="mx-auto max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminThemeProvider>
  );
}
