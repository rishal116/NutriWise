"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import UserAccountSection from "@/components/admin/user-details/UserAccountSection";
import UserDetailsError from "@/components/admin/user-details/UserDetailsError";
import UserDetailsSkeleton from "@/components/admin/user-details/UserDetailsSkeleton";
import UserHealthSection from "@/components/admin/user-details/UserHealthSection";
import UserProfileCard from "@/components/admin/user-details/UserProfileCard";
import { useAdminUserDetails } from "@/hooks/admin/useAdminUserDetails.hooks";

export default function AdminUserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, error, isLoading, retry } = useAdminUserDetails(userId);

  if (isLoading) return <UserDetailsSkeleton />;
  if (error || !user) return <UserDetailsError error={error} onRetry={retry} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-admin-muted transition-colors hover:text-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
      >
        <ArrowLeft size={16} />
        Back to users
      </Link>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <UserProfileCard user={user} />

        <div className="space-y-6">
          <UserAccountSection user={user} />
          <UserHealthSection health={user.healthDetails} />
        </div>
      </div>
    </div>
  );
}