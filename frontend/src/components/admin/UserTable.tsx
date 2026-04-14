"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Lock,
  Unlock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminUserService } from "@/services/admin/adminUser.service";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";
import { useCallback } from "react";

interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export default function UserTable({
  initialData,
}: {
  initialData: PaginatedResponse<UserDTO>;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<UserDTO[]>(initialData.data);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.total);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserDTO | null>(null);

  const perPage = initialData.limit;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminUserService.getAllUsers(
        page,
        perPage,
        debouncedSearch,
      );

      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load users");
    }
  }, [page, perPage, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleBlock = async (user: UserDTO) => {
    try {
      if (user.isBlocked) {
        await adminUserService.unblockUser(user.id);
      } else {
        await adminUserService.blockUser(user.id);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u,
        ),
      );

      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="bg-white">
      {/* Top Header/Search Area */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <UserSearchBar value={search} onChange={setSearch} />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold">User Details</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 uppercase text-[13px]">
                        {u.fullName}
                      </span>
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-tight">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        u.isBlocked
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.isBlocked ? "bg-red-600" : "bg-emerald-600"}`}
                      />
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setActiveUserId(activeUserId === u.id ? null : u.id)
                      }
                      className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                    >
                      <MoreHorizontal size={18} className="text-slate-400" />
                    </button>

                    {activeUserId === u.id && (
                      <div className="absolute right-6 mt-2 w-44 bg-white border border-slate-200 shadow-xl rounded-xl z-20 p-1 animate-in fade-in slide-in-from-top-1">
                        <button
                          onClick={() => router.push(`/admin/users/${u.id}`)}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                        >
                          <ExternalLink size={14} /> View Profile
                        </button>
                        <button
                          onClick={() => {
                            setConfirmUser(u);
                            setActiveUserId(null);
                          }}
                          className={`w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 mt-1 ${
                            u.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {u.isBlocked ? (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          Page <span className="text-slate-900">{page}</span> of{" "}
          <span className="text-slate-900">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MODAL */}
      {confirmUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-slate-900">Confirm Action</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Are you sure you want to{" "}
              {confirmUser.isBlocked ? "unblock" : "block"}{" "}
              <span className="text-slate-900 font-bold italic">
                {confirmUser.fullName}
              </span>
              ?
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConfirmUser(null)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await toggleBlock(confirmUser);
                  setConfirmUser(null);
                }}
                className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
                  confirmUser.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
                }`}
              >
                Yes, {confirmUser.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
