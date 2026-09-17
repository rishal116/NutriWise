"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { nutriGroupService } from "@/services/nutritionist/nutriGroup.service";

import type { GroupDetailsDTO } from "@/dtos/nutritionist/group/group-details.dto";

import GroupDetails from "@/components/nutritionist/group/GroupDetails";

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Loader2 size={20} className="animate-spin" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          Loading group
        </p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <span className="text-xl font-bold">?</span>
        </div>

        <h1 className="mt-5 text-lg font-bold text-slate-900">
          Group not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          The group may no longer exist or you may not have access to it.
        </p>
      </div>
    </div>
  );
}

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();

  const [group, setGroup] = useState<GroupDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await nutriGroupService.getGroupById(groupId);

      setGroup(data);
    } catch {
      setGroup(null);
      toast.error("Unable to load group details.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void fetchGroup();
  }, [fetchGroup]);

  if (loading) {
    return <LoadingState />;
  }

  if (!group) {
    return <NotFoundState />;
  }

  return <GroupDetails group={group} />;
}