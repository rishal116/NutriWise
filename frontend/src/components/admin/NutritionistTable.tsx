"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Lock, Unlock, User } from "lucide-react";
import { adminUserService } from "@/services/admin/adminUser.service";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";
import { useRouter } from "next/navigation";

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
  const perPage = 5;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmNutritionist, setConfirmNutritionist] =
    useState<NutritionistDTO | null>(null);

  /* Reset page on search */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* Fetch nutritionists */
  useEffect(() => {
    fetchNutritionists();
  }, [page, debouncedSearch]);

  const fetchNutritionists = async () => {
    try {
      const res = await adminUserService.getAllNutritionists(
        page,
        perPage,
        debouncedSearch
      );
      console.log(res);
      

  setNutritionists(res.data.data);
setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load nutritionists");
    }
  };

  const toggleBlock = async (n: NutritionistDTO) => {
    try {
      n.isBlocked
        ? await adminUserService.unblockUser(n.id)
        : await adminUserService.blockUser(n.id);

      setNutritionists((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, isBlocked: !item.isBlocked } : item
        )
      );

      toast.success(
        n.isBlocked ? "Nutritionist unblocked" : "Nutritionist blocked"
      );
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
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Account</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {nutritionists.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No nutritionists found
                </td>
              </tr>
            ) : (
              nutritionists.map((n) => (
                <tr
                  key={n.id}
                  className="border-t border-gray-800 hover:bg-gray-900"
                >
                  <td className="px-4 py-3">{n.fullName}</td>
                  <td className="px-4 py-3 text-gray-400">{n.email}</td>

                  <td className="px-4 py-3 text-center capitalize">
                    {n.nutritionistStatus}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        n.isBlocked
                          ? "bg-red-900 text-red-300"
                          : "bg-green-900 text-green-300"
                      }`}
                    >
                      {n.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() =>
                        setActiveId(activeId === n.id ? null : n.id)
                      }
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeId === n.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md z-10">
                        <button
                          onClick={() => {
                            router.push(`/admin/nutritionists/${n.id}`);
                            setActiveId(null);
                          }}
                          className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-800"
                        >
                          <User size={14} /> View Profile
                        </button>

                        <button
                          onClick={() => {
                            setConfirmNutritionist(n);
                            setActiveId(null);
                          }}
                          className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-800"
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

      {/* CONFIRM MODAL */}
      {confirmNutritionist && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-2">Confirm Action</h2>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold text-white">
                {confirmNutritionist.isBlocked ? "unblock" : "block"}
              </span>{" "}
              this nutritionist?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmNutritionist(null)}
                className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await toggleBlock(confirmNutritionist);
                  setConfirmNutritionist(null);
                }}
                className={`px-4 py-2 text-sm rounded text-white ${
                  confirmNutritionist.isBlocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmNutritionist.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
