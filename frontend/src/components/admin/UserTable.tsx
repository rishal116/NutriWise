"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  MoreHorizontal,
  Lock,
  Unlock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminUserService } from "@/services/admin/adminUser.service";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";

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
  totalPages: number;
}

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-teal-400 to-emerald-500",
    "from-blue-400 to-cyan-500",
    "from-violet-400 to-purple-500",
    "from-amber-400 to-orange-500",
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
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserDTO | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const perPage = initialData.limit;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminUserService.getAllUsers(page, perPage, debouncedSearch);
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load users");
    }
  }, [page, perPage, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // ✅ mousedown + ref check — avoids the React synthetic event race condition
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(e.target as Node)
      ) {
        return;
      }
      setActiveUserId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleBlock = async (user: UserDTO) => {
    try {
      if (user.isBlocked) {
        await adminUserService.unblockUser(user.id);
      } else {
        await adminUserService.blockUser(user.id);
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
    } catch {
      toast.error("Action failed");
    }
  };

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, initialData.total);

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <UserSearchBar value={search} onChange={setSearch} />
        <p className="text-[11px] text-slate-400 font-medium shrink-0">
          Showing {startItem}–{endItem} of {initialData.total} users
        </p>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                User
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">
                Role
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
                Status
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                    <Users size={32} strokeWidth={1.2} className="text-slate-300" />
                    <p className="text-sm font-medium">No users found</p>
                    {search && (
                      <p className="text-xs">Try searching for something else</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/60 transition-colors duration-150 group"
                >
                  {/* User details */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <AvatarInitials name={u.fullName} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 truncate">
                          {u.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.isBlocked
                          ? "bg-red-50 text-red-500 border border-red-100"
                          : "bg-teal-50 text-teal-600 border border-teal-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.isBlocked ? "bg-red-400" : "bg-teal-500"
                        }`}
                      />
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right relative">
                    {/* ✅ ref attached to wrapper that contains both trigger + dropdown */}
                    <div
                      ref={activeUserId === u.id ? dropdownRef : null}
                      className="inline-block relative"
                    >
                      <button
                        onClick={() =>
                          setActiveUserId(activeUserId === u.id ? null : u.id)
                        }
                        className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="More actions"
                      >
                        <MoreHorizontal size={16} className="text-slate-400" />
                      </button>

                      {activeUserId === u.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-2xl z-30 p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          <button
                            onClick={() => {
                              router.push(`/admin/users/${u.id}`);
                              setActiveUserId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <ExternalLink size={13} strokeWidth={2} />
                            View Profile
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button
                            onClick={() => {
                              setConfirmUser(u);
                              setActiveUserId(null);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold rounded-xl transition-colors ${
                              u.isBlocked
                                ? "text-teal-600 hover:bg-teal-50"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            {u.isBlocked ? (
                              <><Unlock size={13} strokeWidth={2} /> Unblock User</>
                            ) : (
                              <><Lock size={13} strokeWidth={2} /> Block User</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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

      {/* ── Confirm modal ── */}
      {confirmUser && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setConfirmUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                confirmUser.isBlocked ? "bg-teal-50" : "bg-red-50"
              }`}
            >
              {confirmUser.isBlocked ? (
                <Unlock size={20} className="text-teal-600" strokeWidth={1.8} />
              ) : (
                <Lock size={20} className="text-red-500" strokeWidth={1.8} />
              )}
            </div>

            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
              {confirmUser.isBlocked ? "Unblock User?" : "Block User?"}
            </h2>
            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
              You&apos;re about to{" "}
              {confirmUser.isBlocked ? "restore access for" : "restrict access for"}{" "}
              <span className="font-bold text-slate-800">{confirmUser.fullName}</span>.
              This can be reversed at any time.
            </p>

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setConfirmUser(null)}
                className="flex-1 py-2.5 text-[13px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await toggleBlock(confirmUser);
                  setConfirmUser(null);
                }}
                className={`flex-1 py-2.5 text-[13px] font-bold text-white rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                  confirmUser.isBlocked
                    ? "bg-teal-600 hover:bg-teal-700 shadow-teal-200"
                    : "bg-red-500 hover:bg-red-600 shadow-red-200"
                }`}
              >
                {confirmUser.isBlocked ? "Yes, Unblock" : "Yes, Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}