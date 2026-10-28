import type { Metadata } from "next";

import AdminResources from "@/components/admin/resources/AdminResources";

export const metadata: Metadata = {
  title: "Manage Resources | NutriWise Admin",
  description: "Manage and moderate nutrition resources.",
};

export default function AdminResourcesPage() {
  return <AdminResources />;
}