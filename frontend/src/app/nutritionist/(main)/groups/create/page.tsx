import Link from "next/link";
import { ArrowLeft, UsersRound } from "lucide-react";

import GroupForm from "@/components/nutritionist/group/GroupForm";

export default function CreateGroupPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start gap-4">
        <Link
          href="/nutritionist/groups"
          className="group mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-emerald-200 hover:text-emerald-600"
          aria-label="Back to groups"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-0.5"
          />
        </Link>

        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <UsersRound size={14} />
            Group Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create a new group
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Build a focused community where your clients can connect,
            participate, and stay accountable.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8">
          <p className="text-sm font-semibold text-slate-900">
            Group information
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Keep the name and description clear so members immediately
            understand the purpose of the community.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <GroupForm />
        </div>
      </div>
    </div>
  );
}