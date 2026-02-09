"use client";

import { useEffect, useState } from "react";
import {
  User,
  Camera,
  Save,
  X,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Loader2,
} from "lucide-react";
import ProfileImageUploader from "@/components/common/image";
import Toast from "@/components/common/Toast";
import { userAccountService } from "@/services/user/userProfile.service";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

/* ---------------- Types ---------------- */

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  birthdate: string;
  profileImage?: string;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

/* ---------------- Component ---------------- */

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingForm, setEditingForm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  /* ---------------- Load Profile ---------------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await userAccountService.getProfile();
        const imageRes = await userAccountService.getProfileImage();

        const profile: UserProfile = {
          _id: profileRes.user._id,
          fullName: profileRes.user.fullName || "",
          email: profileRes.user.email || "",
          phone: profileRes.user.phone || "",
          gender: profileRes.user.gender || "",
          birthdate: profileRes.user.birthdate || "",
          profileImage: imageRes.data?.profileImage || "",
        };

        setUser(profile);
        setForm(profile);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load profile", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateAge = (birthdate: string): string => {
    if (!birthdate) return "";
    const birth = new Date(birthdate);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
  };

  const phoneError = !!form?.phone && !isValidPhoneNumber(form.phone);

  const handleSaveForm = async () => {
    if (!form || phoneError) return;

    setSaving(true);
    try {
      await userAccountService.updateProfile(form);
      
      setUser(form);
      setEditingForm(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch {
      setToast({ message: "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(user);
    setEditingForm(false);
  };

  if (loading || !user || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Account Settings
          </h1>
          <p className="text-emerald-50 mt-2 text-sm sm:text-base">
            Manage your profile information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Profile Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              {/* Profile Image */}
              <div className="relative mx-auto w-fit mb-6">
                <img
                  src={user.profileImage || "/images/images.jpg"}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                  alt="Profile"
                />
                <button
                  onClick={() => setShowImageCropper(true)}
                  className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105"
                  aria-label="Change profile picture"
                >
                  <Camera size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h2>

                <div className="text-sm text-gray-600 mt-4 space-y-2">
                  <p className="flex justify-center items-center gap-2">
                    <Mail size={16} className="text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  {user.phone && (
                    <p className="flex justify-center items-center gap-2">
                      <Phone size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                    <ShieldCheck size={16} /> Verified Account
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!editingForm ? (
              <button
                onClick={() => setEditingForm(true)}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancelEdit}
                className="w-full py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* RIGHT COLUMN - Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Personal Information
              </h3>
              {editingForm && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200 w-fit">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={!editingForm}
                icon={<User size={16} className="text-emerald-600" />}
                required
              />

              <PhoneField
                value={form.phone}
                onChange={(phone) =>
                  setForm((prev) => (prev ? { ...prev, phone } : prev))
                }
                error={phoneError}
                disabled={!editingForm}
              />

              <Input
                label="Birthdate"
                name="birthdate"
                type="date"
                value={form.birthdate}
                onChange={handleChange}
                disabled={!editingForm}
                icon={<Calendar size={16} className="text-emerald-600" />}
              />

              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={!editingForm}
              />

              <Input
                label="Age"
                value={calculateAge(form.birthdate)}
                disabled
                icon={<User size={16} className="text-gray-400" />}
              />

              <Input
                label="Email"
                value={form.email}
                disabled
                icon={<Mail size={16} className="text-gray-400" />}
              />
            </div>

            {/* Action Buttons */}
            {editingForm && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors order-2 sm:order-1"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveForm}
                  disabled={phoneError || saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
{/* Inside AccountPage return... */}
{showImageCropper && (
  <ProfileImageUploader 
    onClose={() => setShowImageCropper(false)} 
    onUploadSuccess={(newUrl) => {
      setUser(prev => prev ? { ...prev, profileImage: newUrl } : null);
      setToast({ message: "Image updated successfully!", type: "success" });
    }}
  />
)}

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

/* ---------------- Reusable Input Components ---------------- */

function Input({
  label,
  icon,
  error,
  disabled,
  required,
  ...rest
}: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon} 
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...rest}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border ${
          error 
            ? "border-red-400 focus:ring-red-500" 
            : "border-gray-300 focus:ring-emerald-500"
        } ${
          disabled 
            ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
            : "bg-white"
        } focus:outline-none focus:ring-2 transition-all`}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">Please enter a valid value</p>
      )}
    </div>
  );
}

function Select({ label, disabled, ...rest }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <User size={16} className="text-emerald-600" />
        {label}
      </label>
      <select
        {...rest}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border border-gray-300 ${
          disabled 
            ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
            : "bg-white"
        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}

function PhoneField({ value, onChange, error, disabled }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Phone size={16} className="text-emerald-600" />
        Phone Number
      </label>
      <PhoneInput
        international
        defaultCountry="IN"
        value={value}
        onChange={(val) => onChange(val || "")}
        disabled={disabled}
        className="phone-input-custom"
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">Please enter a valid phone number</p>
      )}
      <style jsx global>{`
        .phone-input-custom input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid ${error ? '#f87171' : '#d1d5db'};
          background-color: ${disabled ? '#f9fafb' : 'white'};
          color: ${disabled ? '#6b7280' : '#111827'};
          cursor: ${disabled ? 'not-allowed' : 'text'};
          transition: all 0.2s;
        }
        .phone-input-custom input:focus {
          outline: none;
          border-color: ${error ? '#ef4444' : '#10b981'};
          box-shadow: 0 0 0 2px ${error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
        }
      `}</style>
    </div>
  );
}