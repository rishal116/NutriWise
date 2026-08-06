import Link from "next/link";
import Image from "next/image";
import { UserProgramCardDTO } from "@/dtos/user/program/user-program-card.dto";
import {
  ProgramStatusBadge,
  SubscriptionStatusBadge,
} from "./ProgramStatusBadge";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function NutritionistAvatar({
  profileImage,
  fullName,
}: {
  profileImage?: string;
  fullName: string;
}) {
  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt={fullName}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
      />
    );
  }

  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      {initials}
    </div>
  );
}

export function ProgramCard({ program }: { program: UserProgramCardDTO }) {


  return (
    <Link
      href={`/user/programs/${program._id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-emerald-700">
          {program.title}
        </h2>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <NutritionistAvatar
          profileImage={program.nutritionist.profileImage}
          fullName={program.nutritionist.fullName}
        />
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Nutritionist</p>
          <p className="truncate text-sm font-medium text-slate-800">
            {program.nutritionist.fullName}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ProgramStatusBadge status={program.programStatus} />
        <SubscriptionStatusBadge status={program.subscriptionStatus} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-slate-800">
            {program.completionPercentage}%
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${program.completionPercentage}%` }}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-slate-500">Day</dt>
        <dd className="text-right font-medium text-slate-800">
          {program.currentDay} / {program.durationDays}
        </dd>

        <dt className="text-slate-500">Start</dt>
        <dd className="text-right text-slate-700">
          {formatDate(program.startDate)}
        </dd>

        <dt className="text-slate-500">End</dt>
        <dd className="text-right text-slate-700">
          {formatDate(program.endDate)}
        </dd>
      </dl>
    </Link>
  );
}
