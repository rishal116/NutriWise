
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";

import type { PublicHomeCommunityGroupDTO } from "@/dtos/public/home/public-home-community-group.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection";

function CommunityGroupCard({
  group,
}: {
  group: PublicHomeCommunityGroupDTO;
}) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-xl font-bold text-emerald-700">
          {group.groupAvatar ? (
            <div
              role="img"
              aria-label={group.title}
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${group.groupAvatar}")`,
              }}
            />
          ) : (
            <Users size={25} />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-900">
            {group.title}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
            <Users size={14} />
            {group.memberCount.toLocaleString()} members
          </p>
        </div>
      </div>

      {group.description && (
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
          {group.description}
        </p>
      )}

      <Link
        href="/communities/groups"
        className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-emerald-700"
      >
        Explore group
        <ArrowUpRight size={18} />
      </Link>
    </article>
  );
}

export default function CommunityGroups() {
  return (
    <HomepageDataSection
      eyebrow="Grow together"
      title="Find your community"
      description="Connect with people who share your interests, experiences, and wellness goals."
      href="/communities/groups"
      fetchData={publicHomepageService.getPublicCommunityGroups}
      renderItem={(group) => <CommunityGroupCard group={group} />}
    />
  );
}
