import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import type { ApplicationStatus } from "@/types/nutritionist.types";

import {
  formatDate,
  getInitials,
  STATUS_STYLES,
} from "./application-table.utils";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

interface ApplicationTableRowsProps {
  applications: AdminNutritionistApplicationListItemDto[];
  isLoading: boolean;
}

export default function ApplicationTableRows({
  applications,
  isLoading,
}: ApplicationTableRowsProps) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/50 font-medium text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Applicant</th>
            <th className="hidden px-6 py-4 font-semibold sm:table-cell">
              Email
            </th>
            <th className="hidden px-6 py-4 font-semibold lg:table-cell">
              Applied On
            </th>
            <th className="px-6 py-4 text-center font-semibold">Status</th>
            <th className="px-6 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {!isLoading && applications.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-slate-400">
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr
                key={application.id}
                className="group transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {application.profileImage ? (
                      <Image
                        src={application.profileImage}
                        alt={application.fullName}
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-emerald-50 text-xs font-bold text-emerald-600">
                        {getInitials(application.fullName)}
                      </div>
                    )}

                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[13px] font-bold text-slate-900">
                        {application.fullName}
                      </span>
                      <span className="truncate text-xs text-slate-500 sm:hidden">
                        {application.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="hidden px-6 py-4 font-medium text-slate-500 sm:table-cell">
                  {application.email}
                </td>

                <td className="hidden px-6 py-4 font-medium text-slate-500 lg:table-cell">
                  {formatDate(application.createdAt)}
                </td>

                <td className="px-6 py-4 text-center">
                  <StatusBadge status={application.applicationStatus} />
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/nutritionists/applications/${application.userId}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-50"
                  >
                    <ExternalLink size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}