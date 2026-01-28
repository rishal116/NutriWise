"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Lock, Unlock } from "lucide-react";
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
  totalPages: number;
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

  const perPage = initialData.limit;

  /* Reset page when search changes */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* Fetch users */
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const fetchUsers = async () => {
    try {
      const res = await adminUserService.getAllUsers(
        page,
        perPage,
        debouncedSearch
      );
      setUsers(res.data);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const toggleBlock = async (user: UserDTO) => {
    try {
      user.isBlocked
        ? await adminUserService.unblockUser(user.id)
        : await adminUserService.blockUser(user.id);

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

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      {/* SEARCH */}
      <UserSearchBar value={search} onChange={setSearch} />

      {/* TABLE */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border border-gray-800">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-800 hover:bg-gray-900"
                >
                  <td className="px-4 py-3">{u.fullName}</td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3 text-center">{u.role}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        u.isBlocked
                          ? "bg-red-900 text-red-300"
                          : "bg-green-900 text-green-300"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() =>
                        setActiveUserId(activeUserId === u.id ? null : u.id)
                      }
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeUserId === u.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md z-10">
                        <button
                          onClick={() => {
                            router.push(`/admin/users/${u.id}`);
                            setActiveUserId(null);
                          }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-800"
                        >
                          View Profile
                        </button>

                        <button
                          onClick={() => {
                            setConfirmUser(u);
                            setActiveUserId(null);
                          }}
                          className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-800"
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border border-gray-700 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-400">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border border-gray-700 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-2">
              Confirm Action
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold text-white">
                {confirmUser.isBlocked ? "unblock" : "block"}
              </span>{" "}
              this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await toggleBlock(confirmUser);
                  setConfirmUser(null);
                }}
                className={`px-4 py-2 text-sm rounded text-white ${
                  confirmUser.isBlocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmUser.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
