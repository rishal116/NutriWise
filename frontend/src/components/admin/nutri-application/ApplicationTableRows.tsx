import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import type { ApplicationStatus } from "@/types/nutritionist.types";

import UserAvatar from "../user/UserAvatar";
import { formatDate, STATUS_STYLES } from "./application-table.utils";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        STATUS_STYLES[status] ?? "bg-admin-surface-hover text-admin-muted"
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
        <thead className="border-b border-admin-border bg-admin-surface-hover font-medium text-admin-muted">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">
              Applicant
            </th>
            <th
              scope="col"
              className="hidden px-6 py-4 font-semibold sm:table-cell"
            >
              Email
            </th>
            <th
              scope="col"
              className="hidden px-6 py-4 font-semibold lg:table-cell"
            >
              Applied On
            </th>
            <th scope="col" className="px-6 py-4 text-center font-semibold">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-admin-border">
          {!isLoading && applications.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-admin-muted"
              >
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr
                key={application.id}
                className="group transition-colors hover:bg-admin-surface-hover"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      fullName={application.fullName}
                      src={application.profileImage}
                    />

                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[13px] font-bold text-admin-text">
                        {application.fullName}
                      </span>
                      <span className="truncate text-xs text-admin-muted sm:hidden">
                        {application.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="hidden px-6 py-4 font-medium text-admin-muted sm:table-cell">
                  {application.email}
                </td>

                <td className="hidden px-6 py-4 font-medium text-admin-muted lg:table-cell">
                  {formatDate(application.createdAt)}
                </td>

                <td className="px-6 py-4 text-center">
                  <StatusBadge status={application.applicationStatus} />
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/nutritionists/${application.userId}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-admin-accent transition-colors hover:bg-admin-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
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