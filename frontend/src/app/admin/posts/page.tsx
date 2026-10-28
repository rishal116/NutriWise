import type { Metadata } from "next";

import AdminPosts from "@/components/admin/posts/AdminPosts";

export const metadata: Metadata = {
  title: "Manage Posts | NutriWise Admin",
  description: "Manage and moderate community posts.",
};

export default function AdminPostsPage() {
  return <AdminPosts />;
}