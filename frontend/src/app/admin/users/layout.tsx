// app/admin/users/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Because the page itself is "use client", metadata must be exported from a
// Server Component — this layout file is that server boundary.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | NutriWise Admin",
  description:
    "View, search, and manage all NutriWise community members. Block or unblock users and monitor account status from the admin dashboard.",
  robots: {
    index: false,   // admin pages must never be indexed by search engines
    follow: false,
  },
  // Open Graph — useful if the admin dashboard is ever shared internally
  openGraph: {
    title: "User Management | NutriWise Admin",
    description: "Manage NutriWise community members from the admin dashboard.",
    type: "website",
  },
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}