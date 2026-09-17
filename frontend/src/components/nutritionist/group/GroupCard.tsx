"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lock, Users } from "lucide-react";

import type { GroupListItemDTO } from "@/dtos/nutritionist/group/group-list-item.dto";

interface GroupCardProps {
  group: GroupListItemDTO;
}

const STATUS_STYLES: Record<GroupListItemDTO["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  inactive: "bg-slate-50 text-slate-600 border-slate-200",
  blocked: "bg-amber-50 text-amber-700 border-amber-100",
  closed: "bg-rose-50 text-rose-700 border-rose-100",
};

const STATUS_LABELS: Record<GroupListItemDTO["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  blocked: "Blocked",
  closed: "Closed",
};

function getInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase() || "G";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GroupCard({ group }: GroupCardProps) {
  const isPrivate = group.visibility === "private";

  return (
    <Link
      href={`/nutritionist/groups/${group.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-200/50"
    >
      <div className="relative h-36 overflow-hidden bg-emerald-50">
        {group.groupAvatar ? (
          <Image
            src={group.groupAvatar}
            alt={group.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-emerald-50">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white">
              {getInitial(group.title)}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${STATUS_STYLES[group.status]}`}
          >
            {STATUS_LABELS[group.status]}
          </span>

          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 backdrop-blur-sm">
            {isPrivate ? <Lock size={11} /> : null}
            {isPrivate ? "Private" : "Public"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
            {group.title}
          </h2>

          <ArrowUpRight
            size={17}
            className="mt-0.5 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-600"
          />
        </div>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {group.description || "No description added for this group."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
              <Users size={15} />
            </span>

            <span>
              {group.memberCount}{" "}
              {group.memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {formatDate(group.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}