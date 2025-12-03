"use client";
import { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, User, Lock, Unlock } from "lucide-react";
import { adminUserService } from "@/services/admin/adminUser.service";
import { toast } from "react-hot-toast";

interface NutritionistDTO {
  id: string;
  name: string;
  email: string;
  nutritionistStatus: "approved" | "pending" | "rejected" | string;
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface NutritionistTableProps {
  initialData: PaginatedResponse<NutritionistDTO>;
}

export default function NutritionistTable({ initialData }: NutritionistTableProps) {
  const [nutritionists, setNutritionists] = useState<NutritionistDTO[]>(initialData.data);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState<{ id: string; top: number; left: number } | null>(null);
  const perPage = initialData.limit;
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        const res = await adminUserService.getAllNutritionists(page, perPage, search);
        setNutritionists(res.data);
        setTotalPages(res.totalPages);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch nutritionists");
      }
    };
    fetchNutritionists();
  }, [page, search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
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

      toast.success(isBlocked ? "Nutritionist unblocked" : "Nutritionist blocked");
      setNutritionists((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isBlocked: !isBlocked } : n))
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
    setDropdown(null);
  };

  return (
    <div>
      {/* Search */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-auto">
        <table className="w-full text-sm text-gray-700 min-w-[700px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Account</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nutritionists.map((n) => (
              <tr key={n.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{n.name}</td>
                <td className="px-6 py-4">{n.email}</td>
                <td className="px-6 py-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      n.nutritionistStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : n.nutritionistStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : n.nutritionistStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {n.nutritionistStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      n.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {n.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={(e) => toggleDropdown(n.id, e)}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {dropdown?.id === n.id && (
                    <div
                      ref={dropdownRef}
                      style={{ top: dropdown.top, left: dropdown.left }}
                      className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      <button
                        onClick={() => alert(`Viewing ${n.name}`)}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                      >
                        <User className="w-4 h-4 mr-2" /> View Profile
                      </button>
                      <button
                        onClick={() => handleBlockToggle(n.id, n.isBlocked)}
                        className={`w-full flex items-center px-4 py-2 hover:bg-gray-50 text-sm ${
                          n.isBlocked ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {n.isBlocked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        {n.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
