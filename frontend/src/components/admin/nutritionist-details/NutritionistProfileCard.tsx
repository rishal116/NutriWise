import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Globe,
  Star,
  User,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";
import type { CoachLevel } from "@/types/nutritionist.types";

import CoachLevelSelect from "./CoachLevelSelect";
import { formatDate, formatLabel } from "./nutritionist-details.utils";

const FALLBACK_STYLE = "bg-slate-100 text-slate-600";

const APPLICATION_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

const AVAILABILITY_STYLES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  busy: "bg-amber-50 text-amber-700",
  offline: FALLBACK_STYLE,
};

function Pill({
  className,
  children,
}: {
  className: string;
  children: string;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="shrink-0 text-slate-400" />
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="break-words text-sm font-medium text-slate-800">
          {value}
        </dd>
      </div>
    </div>
  );
}

interface NutritionistProfileCardProps {
  details: AdminNutritionistDetailsDto;
  isUpdatingLevel: boolean;
  onCoachLevelChange: (level: CoachLevel) => void;
}

export default function NutritionistProfileCard({
  details,
  isUpdatingLevel,
  onCoachLevelChange,
}: NutritionistProfileCardProps) {
  const meta = [
    {
      icon: CalendarDays,
      label: "Applied on",
      value: formatDate(details.createdAt),
    },
    {
      icon: Clock3,
      label: "Last updated",
      value: formatDate(details.updatedAt),
    },
    {
      icon: Globe,
      label: "Languages",
      value: details.languages.length
        ? details.languages.map(formatLabel).join(", ")
        : "—",
    },
    {
      icon: UserRound,
      label: "Gender",
      value: details.gender ? formatLabel(details.gender) : "—",
    },
  ];

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:self-start">
      <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-500" />

      <div className="px-5 pb-6 sm:px-6">
        <div className="relative -mt-12 flex size-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-emerald-50 text-emerald-300">
          {details.profileImage ? (
            <Image
              src={details.profileImage}
              alt={`${details.fullName}'s profile`}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <User size={40} />
          )}
        </div>

        <h1 className="mt-4 break-words text-xl font-bold text-slate-900">
          {details.fullName}
        </h1>
        <p className="text-sm text-slate-500">@{details.username}</p>
        <p className="mt-1 break-all text-sm text-slate-500">{details.email}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill
            className={
              APPLICATION_STYLES[details.applicationStatus] ?? FALLBACK_STYLE
            }
          >
            {details.applicationStatus}
          </Pill>
          <Pill
            className={
              AVAILABILITY_STYLES[details.availabilityStatus] ?? FALLBACK_STYLE
            }
          >
            {details.availabilityStatus}
          </Pill>
          {details.isBlocked && (
            <Pill className="bg-rose-50 text-rose-700">Blocked</Pill>
          )}
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          {details.rating.toFixed(1)}
          <span className="font-medium text-slate-400">
            ({details.totalReviews} reviews)
          </span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Clients coached" value={details.totalPeopleCoached} />
          <Stat
            label="Experience"
            value={`${details.totalExperienceYears} yrs`}
          />
        </div>

        <div className="mt-5">
          <CoachLevelSelect
            value={details.coachLevel}
            disabled={isUpdatingLevel}
            onChange={onCoachLevelChange}
          />
        </div>

        <dl className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          {meta.map((item) => (
            <MetaRow key={item.label} {...item} />
          ))}
        </dl>
      </div>
    </aside>
  );
}
