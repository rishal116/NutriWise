"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { groupService } from "@/services/nutritionist/nutriCommunity.service";
import { Users, Lock, Globe, LoaderCircle } from "lucide-react";

const CreateGroup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    isPublic: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePrivacy = () => {
    setForm((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setLoading(true);
    try {
      await groupService.createGroup({
        title: form.title.trim(),
        description: form.description.trim(),
        isPublic: form.isPublic,
      });

      router.push("/nutritionist/groups"); // ✅ updated route
      router.refresh();
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setLoading(false);
    }
  };

  const baseInputStyles =
    "w-full bg-slate-50/60 border border-slate-100 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none p-4 rounded-2xl transition-all placeholder:text-slate-300";

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 pt-4 px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-slate-100/70 shadow-2xl shadow-emerald-100/30">
        
        {/* Header */}
        <div className="flex items-center gap-5 mb-12 pb-8 border-b border-slate-100/70">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner">
            <Users className="text-emerald-600" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Create Group
            </h2>
            <p className="text-base text-slate-500">
              Build a space for your clients to chat, share and grow.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Group Title
            </label>
            <input
              name="title"
              placeholder="e.g. Fat Loss Beginners"
              className={baseInputStyles}
              onChange={handleChange}
              value={form.title}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your group..."
              rows={4}
              className={`${baseInputStyles} resize-none`}
              onChange={handleChange}
              value={form.description}
            />
          </div>

          {/* Privacy */}
          <div
            onClick={togglePrivacy}
            className={`flex justify-between p-6 rounded-3xl cursor-pointer transition
              ${
                form.isPublic
                  ? "bg-slate-50 border"
                  : "bg-emerald-50 border-emerald-200"
              }`}
          >
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-white rounded-xl shadow">
                {form.isPublic ? <Globe /> : <Lock />}
              </div>
              <div>
                <p className="font-bold">
                  {form.isPublic ? "Public Group" : "Private Group"}
                </p>
                <p className="text-sm text-gray-500">
                  {form.isPublic
                    ? "Anyone can join"
                    : "Invite only group"}
                </p>
              </div>
            </div>

            <div
              className={`w-12 h-6 rounded-full ${
                form.isPublic ? "bg-gray-300" : "bg-emerald-500"
              }`}
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold"
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <LoaderCircle className="animate-spin" /> Creating...
              </span>
            ) : (
              "Create Group"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;