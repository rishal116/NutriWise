"use client";
import { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, User, Lock, Unlock } from "lucide-react";
import { adminUserService } from "@/services/admin/Adminuser.service";
import { toast } from "react-hot-toast";

interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function UserTable({ initialData }: { initialData: PaginatedResponse<UserDTO> }) {
  const [users, setUsers] = useState<UserDTO[]>(initialData.data);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [dropdown, setDropdown] = useState<{ id: string; top: number; left: number } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const perPage = initialData.limit;

  // Fetch users whenever page or search changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminUserService.getAllUsers(page, perPage, search);
        setUsers(response.data);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [page, search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  const toggleDropdown = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdown(
      dropdown?.id === id
        ? null
        : { id, top: rect.bottom + window.scrollY, left: rect.right + window.scrollX - 180 }
    );
  };

  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    try {
      if (isBlocked) await adminUserService.unblockUser(id);
      else await adminUserService.blockUser(id);

      toast.success(isBlocked ? "User unblocked" : "User blocked");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isBlocked: !isBlocked } : u)));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
    setDropdown(null);
  };

  return (
    <div>
      {/* SEARCH */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm 
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-auto">
        <table className="w-full text-sm text-gray-700 min-w-[700px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-center">Account</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    onClick={(e) => toggleDropdown(u.id, e)}
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* DROPDOWN */}
        {dropdown && (
          <div
            ref={dropdownRef}
            style={{ top: dropdown.top, left: dropdown.left }}
            className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <button
              onClick={() => alert(`Viewing ${dropdown.id}`)}
              className="w-full flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
            >
              <User className="w-4 h-4 mr-2" /> View Profile
            </button>

            <button
              onClick={() => {
                const u = users.find((x) => x.id === dropdown.id);
                if (u) handleBlockToggle(u.id, u.isBlocked);
              }}
              className={`w-full flex items-center px-4 py-2 hover:bg-gray-50 text-sm ${
                users.find((x) => x.id === dropdown.id)?.isBlocked ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {users.find((x) => x.id === dropdown.id)?.isBlocked ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" /> Unblock User
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" /> Block User
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Prev
            </button>

            <span className="text-gray-600 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
