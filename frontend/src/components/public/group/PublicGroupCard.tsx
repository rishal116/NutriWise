import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, Globe2, Users } from "lucide-react";

import type { PublicGroupListItemDTO } from "@/dtos/public/group/public-group-list-item.dto";

interface PublicGroupCardProps {
  group: PublicGroupListItemDTO;
}

function getInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase() || "G";
}

export default function PublicGroupCard({
  group,
}: PublicGroupCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-emerald-50">
        {group.groupAvatar ? (
          <Image
            src={group.groupAvatar}
            alt={group.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 text-3xl font-bold text-white">
              {getInitial(group.title)}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm">
            <Globe2 size={11} />
            Public
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="min-h-[84px]">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
            {group.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {group.description || "No description available."}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Users size={14} />
            {group.memberCount}{" "}
            {group.memberCount === 1 ? "member" : "members"}
          </span>

          <Link
            href={`/communities/groups/${group.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            View group
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}