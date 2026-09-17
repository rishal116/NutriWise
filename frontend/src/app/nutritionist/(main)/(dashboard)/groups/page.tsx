import Link from "next/link";
import { Plus, UsersRound } from "lucide-react";

import GroupList from "@/components/nutritionist/group/GroupList";

export default function NutritionistGroupsPage() {
  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <UsersRound size={14} />
            Nutritionist Community
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Groups
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Create and manage supportive communities for your clients.
          </p>
        </div>

        <Link
          href="/nutritionist/groups/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus size={17} />
          Create Group
        </Link>
      </header>

      <GroupList />
    </div>
  );
}