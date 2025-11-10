"use client";
import { useEffect, useState, useRef } from "react";
import { Search, MoreVertical, User, Lock, Unlock } from "lucide-react";
import { adminUserService } from "@/services/admin/Adminuser.service";
import { toast } from "react-hot-toast";

interface UserType {
  _id: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
}

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown state: id + coordinates
  const [dropdown, setDropdown] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminUserService.getAllUsers();
        setUsers(response.clients || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: !isBlocked } : u))
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
    setDropdown(null);
  };

  const filteredData = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ml-72 mt-24 p-8 min-h-screen bg-gray-50 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          User Management
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-auto relative">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No users found.</div>
        ) : (
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
              {filteredData.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{u.fullName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        u.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                      onClick={(e) => toggleDropdown(u._id, e)}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Dropdown rendered outside of table */}
        {dropdown && (
          <div
            ref={dropdownRef}
            style={{ top: dropdown.top, left: dropdown.left }}
            className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <button
              onClick={() => alert(`Viewing ${dropdown.id}`)}
              className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 text-gray-700 text-sm"
            >
              <User className="w-4 h-4 mr-2 text-gray-500" /> View Profile
            </button>

            <button
              onClick={() => {
                const u = users.find((x) => x._id === dropdown.id);
                if (u) handleBlockToggle(u._id, u.isBlocked);
              }}
              className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 text-sm ${
                users.find((x) => x._id === dropdown.id)?.isBlocked
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {users.find((x) => x._id === dropdown.id)?.isBlocked ? (
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
    </div>
  );
}
