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

const FALLBACK_STYLE = "bg-admin-surface-hover text-admin-muted";
const SUCCESS_STYLE = "bg-admin-pastel-green text-admin-success";
const WARNING_STYLE = "bg-admin-warning/15 text-admin-warning";
const DANGER_STYLE = "bg-admin-danger-soft text-admin-danger";

const APPLICATION_STYLES: Record<string, string> = {
  pending: WARNING_STYLE,
  approved: SUCCESS_STYLE,
  rejected: DANGER_STYLE,
};

const AVAILABILITY_STYLES: Record<string, string> = {
  available: SUCCESS_STYLE,
  busy: WARNING_STYLE,
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

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className={`rounded-xl p-3 ${tone}`}>
      <p className="text-[10px] font-bold uppercase text-admin-text/70">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-admin-text">{value}</p>
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
      <Icon size={16} className="shrink-0 text-admin-muted" />
      <div className="min-w-0">
        <dt className="text-xs text-admin-muted">{label}</dt>
        <dd className="break-words text-sm font-medium text-admin-text">
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
    <aside className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5 lg:sticky lg:top-24 lg:self-start">
      <div className="h-20 bg-linear-to-r from-admin-accent-hover to-admin-accent" />

      <div className="px-5 pb-6 sm:px-6">
        <div className="relative -mt-12 flex size-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-admin-surface bg-admin-accent-soft text-admin-accent/40">
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

        <h1 className="mt-4 break-words text-xl font-bold text-admin-text">
          {details.fullName}
        </h1>
        <p className="text-sm text-admin-muted">@{details.username}</p>
        <p className="mt-1 break-all text-sm text-admin-muted">
          {details.email}
        </p>

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
          {details.isBlocked && <Pill className={DANGER_STYLE}>Blocked</Pill>}
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-admin-text">
          <Star size={16} className="fill-admin-warning text-admin-warning" />
          {details.rating.toFixed(1)}
          <span className="font-medium text-admin-muted">
            ({details.totalReviews} reviews)
          </span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat
            label="Clients coached"
            value={details.totalPeopleCoached}
            tone="bg-admin-pastel-blue"
          />
          <Stat
            label="Experience"
            value={`${details.totalExperienceYears} yrs`}
            tone="bg-admin-pastel-green"
          />
        </div>

        <div className="mt-5">
          <CoachLevelSelect
            value={details.coachLevel}
            disabled={isUpdatingLevel}
            onChange={onCoachLevelChange}
          />
        </div>

        <dl className="mt-6 space-y-4 border-t border-admin-border pt-5">
          {meta.map((item) => (
            <MetaRow key={item.label} {...item} />
          ))}
        </dl>
      </div>
    </aside>
  );
}