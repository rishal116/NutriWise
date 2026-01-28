"use client";

import { useEffect, useState } from "react";
import { User, Camera, Save, X, ShieldCheck, Mail, Phone, Calendar, Users } from "lucide-react";
import ProfileImageUploader from "@/components/common/ProfileImageUploader";
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
  const [editingForm, setEditingForm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ---------------- Helpers ---------------- */

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

  /* ---------------- Save Profile ---------------- */

  const handleSaveForm = async () => {
    if (!form || phoneError) return;

    try {
      const payload = { ...form, birthDate: form.birthdate };
      await userAccountService.updateProfile(payload);
      setUser(form);
      setEditingForm(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update profile.", type: "error" });
    }
  };

  /* ---------------- Image Upload ---------------- */

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const res = await userAccountService.uploadProfileImage(file);

      if (!form || !user) return;

      const updated = { ...form, profileImage: res.profileImage };
      setUser(updated);
      setForm(updated);
      setShowImageCropper(false);
      setToast({ message: "Profile image updated!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Image upload failed.", type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  /* ---------------- Loading Skeleton ---------------- */

  if (loading || !user || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-8">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-32 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-3xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-80 bg-white/50 rounded-3xl"></div>
            <div className="h-80 bg-white/50 rounded-3xl lg:col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-emerald-100">Manage your profile information and account preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="relative -mt-20 mb-4 flex justify-center">
                  <div className="relative group/img">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-50 group-hover/img:opacity-75 transition-opacity"></div>
                    <img
                      src={user.profileImage || "/images/images.jpg"}
                      className="relative w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-2xl"
                      alt="Profile"
                    />
                    <button
                      onClick={() => setShowImageCropper(true)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 text-white rounded-3xl transition-all duration-300"
                    >
                      <Camera size={28} className="mb-2" />
                      <span className="text-sm font-medium">Change Photo</span>
                    </button>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-emerald-500" />
                    <span>{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-teal-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm rounded-full font-medium shadow-sm">
                    <ShieldCheck size={16} /> Verified Account
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditingForm(!editingForm)}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group ${
                editingForm
                  ? "bg-white text-gray-700 hover:bg-gray-50"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              }`}
            >
              <span className="relative z-10">
                {editingForm ? (
                  <>✕ Cancel Edit</>
                ) : (
                  <>✏️ Edit Profile</>
                )}
              </span>
              {!editingForm && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              )}
            </button>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            {showImageCropper && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl max-w-lg w-full relative shadow-2xl">
                  <button
                    onClick={() => setShowImageCropper(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Upload Profile Photo</h3>
                  <ProfileImageUploader onCropped={handleImageUpload} />
                </div>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<User size={18} />}
                />

                <PhoneField
                  value={form.phone}
                  onChange={(phone) =>
                    setForm((prev) => (prev ? { ...prev, phone } : prev))
                  }
                  error={phoneError}
                  errorMessage="Please enter a valid phone number"
                  disabled={!editingForm}
                />

                <Input
                  label="Birthdate"
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<Calendar size={18} />}
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<Users size={18} />}
                />

                <Input
                  label="Age"
                  value={calculateAge(form.birthdate) || "N/A"}
                  disabled
                  icon={<Calendar size={18} />}
                />

                <Input
                  label="Email"
                  value={form.email}
                  disabled
                  icon={<Mail size={18} />}
                />
              </div>

              {editingForm && (
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => setEditingForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveForm}
                    disabled={phoneError}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold disabled:from-gray-300 disabled:to-gray-400 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
                  >
                    <Save size={18} />
                    <span className="relative z-10">Save Changes</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

/* ---------------- Input Components ---------------- */

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: boolean; icon?: React.ReactNode }) {
  const { label, error, icon, disabled, ...rest } = props;
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon && <span className="text-emerald-600">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          disabled={disabled}
          className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition-all duration-300
          bg-white/70 backdrop-blur-sm font-medium
          ${disabled 
            ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" 
            : error 
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
              : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        />
        {!error && !disabled && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span> Invalid input
        </p>
      )}
    </div>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon?: React.ReactNode }) {
  const { label, icon, disabled, ...rest } = props;
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon && <span className="text-emerald-600">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          {...rest}
          disabled={disabled}
          className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition-all duration-300
          bg-white/70 backdrop-blur-sm font-medium appearance-none cursor-pointer
          ${disabled 
            ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" 
            : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </div>
        {!disabled && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}

function PhoneField({
  value,
  onChange,
  error,
  errorMessage,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Phone size={18} className="text-emerald-600" />
        Phone Number
      </label>

      <div className="relative">
        <PhoneInput
          international
          defaultCountry="IN"
          value={value}
          onChange={(val) => onChange(val || "")}
          disabled={disabled}
          className={`w-full rounded-xl border-2 p-4 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium ${
            disabled
              ? "bg-gray-50 cursor-not-allowed border-gray-200"
              : error 
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100" 
                : "border-gray-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 hover:border-emerald-300"
          }`}
        />
        {!error && !disabled && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        )}
      </div>

      {error && errorMessage && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span> {errorMessage}
        </p>
      )}
    </div>
  );
}