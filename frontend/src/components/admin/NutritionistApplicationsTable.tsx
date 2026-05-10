"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  XCircle,
  FileCheck,
} from "lucide-react";
import { adminNutriService } from "@/services/admin/adminNutri.service";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";
import { useRouter } from "next/navigation";

interface NutritionistApplicationDTO {
  id: string;
  fullName: string;
  email: string;
  nutritionistStatus: "pending" | "rejected";
  rejectionReason?: string;
}

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-amber-400 to-orange-500",
    "from-violet-400 to-purple-500",
    "from-blue-400 to-cyan-500",
    "from-pink-400 to-rose-500",
  ];

  const idx = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}
    >
      {initials}
    </div>
  );
}

const STATUS_CONFIG = {
  pending: {
    bg: "bg-amber-50 border-amber-100",
    text: "text-amber-700",
    icon: <Clock size={11} strokeWidth={2.5} />,
  },
  rejected: {
    bg: "bg-red-50 border-red-100",
    text: "text-red-600",
    icon: <XCircle size={11} strokeWidth={2.5} />,
  },
};

export default function NutritionistApplicationsTable() {
  const router = useRouter();

  const [applications, setApplications] = useState<
    NutritionistApplicationDTO[]
  >([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeId, setActiveId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const perPage = 8;

  const fetchApplications = useCallback(async () => {
    try {
      const res = await adminNutriService.getNutritionistApplications(
        page,
        perPage,
        debouncedSearch
      );

      setApplications(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load nutritionist applications");
    }
  }, [page, perPage, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(e.target as Node)
      ) {
        return;
      }
      setActiveId(null);
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <UserSearchBar value={search} onChange={setSearch} />

        <p className="text-[11px] text-slate-400 font-medium shrink-0">
          Page {page} of {totalPages}
        </p>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Applicant
              </th>

              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
                Application Status
              </th>

              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                    <FileCheck
                      size={32}
                      strokeWidth={1.2}
                      className="text-slate-300"
                    />
                    <p className="text-sm font-medium">
                      No nutritionist applications found
                    </p>
                    {search && (
                      <p className="text-xs">
                        Try searching for something else
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const s = STATUS_CONFIG[app.nutritionistStatus];

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/60 transition-colors duration-150 group"
                  >
                    {/* Applicant */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <AvatarInitials name={app.fullName} />

                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-800 truncate">
                            {app.fullName}
                          </p>

                          <p className="text-[11px] text-slate-400 truncate">
                            {app.email}
                          </p>

                          {app.rejectionReason && (
                            <p className="text-[10px] text-red-400 truncate mt-1">
                              Reason: {app.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.bg} ${s.text}`}
                      >
                        {s.icon}
                        {app.nutritionistStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right relative">
                      <div
                        ref={activeId === app.id ? dropdownRef : null}
                        className="inline-block relative"
                      >
                        <button
                          onClick={() =>
                            setActiveId(
                              activeId === app.id ? null : app.id
                            )
                          }
                          className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <MoreHorizontal
                            size={16}
                            className="text-slate-400"
                          />
                        </button>

                        {activeId === app.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-2xl z-30 p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                            <button
                              onClick={() => {
                                router.push(
                                  `/admin/nutritionists/${app.id}`
                                );
                                setActiveId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                              <ExternalLink
                                size={13}
                                strokeWidth={2}
                              />
                              View Application
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4">
        <p className="text-[11px] text-slate-400 font-medium">
          Page <span className="text-slate-700 font-bold">{page}</span> of{" "}
          <span className="text-slate-700 font-bold">{totalPages}</span>
        </p>

        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-600 border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-600 border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}