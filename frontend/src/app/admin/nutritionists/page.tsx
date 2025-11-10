"use client";
import { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { adminUserService } from "@/services/admin/Adminuser.service";
import { toast } from "react-hot-toast";

interface Nutritionist {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  nutritionistStatus: string;
  isBlocked: boolean;
}

export default function NutritionistsPage() {
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        setLoading(true);
        const res = await adminUserService.getAllNutritionists();
        setNutritionists(res.nutritionists || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load nutritionists");
      } finally {
        setLoading(false);
      }
    };
    fetchNutritionists();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    try {
      if (isBlocked) await adminUserService.unblockUser(id);
      else await adminUserService.blockUser(id);
      toast.success(isBlocked ? "Nutritionist unblocked" : "Nutritionist blocked");
      setNutritionists((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isBlocked: !isBlocked } : n))
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
    setOpenDropdown(null);
  };

  const filteredData = nutritionists.filter((n) =>
    n.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ml-72 mt-24 p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Nutritionists Management
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No nutritionists found.</div>
        ) : (
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Account</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((n) => (
                <tr
                  key={n._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{n.fullName}</td>
                  <td className="px-6 py-4">{n.email}</td>
                  <td className="px-6 py-4">{n.phone}</td>
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
                        n.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {n.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                      onClick={() => toggleDropdown(n._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openDropdown === n._id && (
                      <div className="absolute right-8 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => alert(`Viewing ${n.fullName}`)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleBlockToggle(n._id, n.isBlocked)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                        >
                          {n.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
