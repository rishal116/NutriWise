"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Lock,
  Unlock,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { adminUserService } from "@/services/admin/adminUser.service";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface NutritionistDTO {
  id: string;
  fullName: string;
  email: string;
  nutritionistStatus: "approved" | "pending" | "rejected";
  isBlocked: boolean;
}

export default function NutritionistTable() {
  const router = useRouter();
  const [nutritionists, setNutritionists] = useState<NutritionistDTO[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 8;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmNutritionist, setConfirmNutritionist] =
    useState<NutritionistDTO | null>(null);

  const fetchNutritionists = useCallback(async () => {
    try {
      const res = await adminUserService.getAllNutritionists(
        page,
        perPage,
        debouncedSearch,
      );
      
      
      setNutritionists(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load nutritionists");
    }
  }, [page, perPage, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchNutritionists();
  }, [fetchNutritionists]);

  const toggleBlock = async (n: NutritionistDTO) => {
    try {
      if (n.isBlocked) {
        await adminUserService.unblockUser(n.id);
      } else {
        await adminUserService.blockUser(n.id);
      }

      setNutritionists((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, isBlocked: !item.isBlocked } : item,
        ),
      );

      const action = n.isBlocked ? "unblocked" : "blocked";
      toast.success(`Nutritionist ${action}`);
    } catch {
      toast.error("Action failed");
    }
  };

  const getStatusUI = (status: string) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: <CheckCircle2 size={12} />,
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: <Clock size={12} />,
        };
      case "rejected":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          icon: <XCircle size={12} />,
        };
      default:
        return { bg: "bg-slate-50", text: "text-slate-700", icon: null };
    }
  };

  return (
    <div className="bg-white">
      <div className="p-4 border-b border-slate-100">
        <UserSearchBar value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Professional</th>
              <th className="px-6 py-4 text-center">Verification</th>
              <th className="px-6 py-4 text-center">Account Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {nutritionists.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-slate-400 font-medium"
                >
                  No nutritionists found
                </td>
              </tr>
            ) : (
              nutritionists.map((n) => {
                const statusStyle = getStatusUI(n.nutritionistStatus);
                return (
                  <tr
                    key={n.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 uppercase text-[13px]">
                          {n.fullName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {n.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.icon}
                          {n.nutritionistStatus}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            n.isBlocked
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {n.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setActiveId(activeId === n.id ? null : n.id)
                        }
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <MoreHorizontal size={18} className="text-slate-400" />
                      </button>

                      {activeId === n.id && (
                        <div className="absolute right-6 mt-2 w-44 bg-white border border-slate-200 shadow-xl rounded-xl z-20 p-1 animate-in fade-in slide-in-from-top-1">
                          <button
                            onClick={() => {
                              router.push(`/admin/nutritionists/${n.id}`);
                              setActiveId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                          >
                            <User size={14} /> View Profile
                          </button>
                          <button
                            onClick={() => {
                              setConfirmNutritionist(n);
                              setActiveId(null);
                            }}
                            className={`w-full px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 mt-1 ${
                              n.isBlocked
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {n.isBlocked ? (
                              <>
                                <Unlock size={14} /> Unblock
                              </>
                            ) : (
                              <>
                                <Lock size={14} /> Block
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modern Modal */}
      {confirmNutritionist && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-slate-900">
              Security Action
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Are you sure you want to{" "}
              {confirmNutritionist.isBlocked ? "unblock" : "block"}{" "}
              <span className="text-slate-900 font-bold italic">
                {confirmNutritionist.fullName}
              </span>
              ?
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConfirmNutritionist(null)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await toggleBlock(confirmNutritionist);
                  setConfirmNutritionist(null);
                }}
                className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
                  confirmNutritionist.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
                }`}
              >
                Yes, {confirmNutritionist.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
