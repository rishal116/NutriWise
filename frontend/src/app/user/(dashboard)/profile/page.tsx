"use client";

import { useEffect, useState } from "react";
import {
  User,
  Camera,
  Save,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import ProfileImageUploader from "@/components/common/image";
import Toast from "@/components/common/Toast";
import { userAccountService } from "@/services/user/userProfile.service";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

/* ── TYPES ── */
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

/* ── PAGE ── */
export default function AccountPage() {
  const [user,             setUser]             = useState<UserProfile | null>(null);
  const [form,             setForm]             = useState<UserProfile | null>(null);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [editingForm,      setEditingForm]      = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [toast,            setToast]            = useState<ToastState | null>(null);

  /* ── fetch ── */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRes = await userAccountService.getProfile();
        const imageRes   = await userAccountService.getProfileImage();

        const profile: UserProfile = {
          _id:          profileRes.user._id,
          fullName:     profileRes.user.fullName   || "",
          email:        profileRes.user.email       || "",
          phone:        profileRes.user.phone       || "",
          gender:       profileRes.user.gender      || "",
          birthdate:    profileRes.user.birthdate   || "",
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
    }
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateAge = (birthdate: string): string => {
    if (!birthdate) return "—";
    const diff = Date.now() - new Date(birthdate).getTime();
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} yrs`;
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

  /* ── loading ── */
  if (loading || !user || !form) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans pb-12 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl px-7 py-9 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-14 -mt-14 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-8 -mb-8 blur-2xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
            Account Settings
          </h1>
          <p className="text-white/70 text-sm font-medium">
            Manage your profile information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT — PROFILE CARD ── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Avatar */}
            <div className="relative w-fit mx-auto mb-5">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-sm opacity-25" />
              <img
                src={user.profileImage || "/images/images.jpg"}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                alt={user.fullName}
              />
              <button
                onClick={() => setShowImageCropper(true)}
                className="absolute bottom-1 right-1 w-9 h-9 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                aria-label="Change profile picture"
              >
                <Camera size={15} />
              </button>
            </div>

            {/* Name + badge */}
            <div className="text-center mb-5">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                {user.fullName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                <ShieldCheck size={12} />
                Verified Account
              </span>
            </div>

            {/* Contact info */}
            <div className="space-y-2.5 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                <div className="bg-emerald-100 p-1.5 rounded-lg flex-shrink-0">
                  <Mail size={13} className="text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-teal-100 p-1.5 rounded-lg flex-shrink-0">
                    <Phone size={13} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.birthdate && (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0">
                    <Calendar size={13} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Age</p>
                    <p className="text-sm font-semibold text-gray-800">{calculateAge(user.birthdate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit / Cancel button */}
          {!editingForm ? (
            <button
              onClick={() => setEditingForm(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-emerald-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              <Pencil size={14} className="flex-shrink-0" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancelEdit}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              <X size={14} className="flex-shrink-0" />
              Cancel Edit
            </button>
          )}
        </div>

        {/* ── RIGHT — FORM ── */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Card header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />
                <h3 className="text-sm font-extrabold text-gray-900">Personal Information</h3>
              </div>
              {editingForm && (
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                  Editing
                </span>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <FieldInput
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<User size={13} className="text-emerald-600" />}
                  required
                />

                <PhoneField
                  value={form.phone}
                  onChange={(phone: string) =>
                    setForm((prev) => (prev ? { ...prev, phone } : prev))
                  }
                  error={phoneError}
                  disabled={!editingForm}
                />

                <FieldInput
                  label="Birthdate"
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<Calendar size={13} className="text-emerald-600" />}
                />

                <GenderSelect
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editingForm}
                />

                <FieldInput
                  label="Age"
                  value={calculateAge(form.birthdate)}
                  disabled
                  icon={<User size={13} className="text-gray-400" />}
                />

                <FieldInput
                  label="Email"
                  value={form.email}
                  disabled
                  icon={<Mail size={13} className="text-gray-400" />}
                />
              </div>

              {/* Save / cancel row */}
              {editingForm && (
                <div className="pt-5 border-t border-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveForm}
                    disabled={phoneError || saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-emerald-100 hover:shadow-md transition-all disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={15} className="animate-spin flex-shrink-0" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={15} className="flex-shrink-0" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && (
        <ProfileImageUploader
          onClose={() => setShowImageCropper(false)}
          onUploadSuccess={(newUrl: string) => {
            setUser((prev) => (prev ? { ...prev, profileImage: newUrl } : null));
            setToast({ message: "Image updated successfully!", type: "success" });
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

/* ── FIELD INPUT ── */
function FieldInput({
  label,
  icon,
  error,
  disabled,
  required,
  ...rest
}: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
        {icon}
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        {...rest}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-400"
        } ${
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-800"
        }`}
      />
      {error && (
        <p className="text-[10px] text-red-500 font-semibold">
          Please enter a valid value
        </p>
      )}
    </div>
  );
}

/* ── GENDER SELECT ── */
function GenderSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
        <User size={13} className="text-emerald-600" />
        Gender
      </label>
      <select
        name="gender"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 ${
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white text-gray-800 border-gray-200"
        }`}
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}

/* ── PHONE FIELD ── */
function PhoneField({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  error: boolean;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
        <Phone size={13} className="text-emerald-600" />
        Phone Number
      </label>
      <div
        className={`phone-wrap rounded-xl border transition-all ${
          error ? "border-red-300" : "border-gray-200"
        } ${disabled ? "bg-gray-50" : "bg-white"}`}
      >
        <PhoneInput
          international
          defaultCountry="IN"
          value={value}
          onChange={(val) => onChange(val || "")}
          disabled={disabled}
          className="nutriwise-phone"
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-semibold">
          Please enter a valid phone number
        </p>
      )}
      <style jsx global>{`
        .nutriwise-phone {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          height: 42px;
        }
        .nutriwise-phone .PhoneInputCountrySelect {
          background: transparent;
          border: none;
          outline: none;
          font-size: 13px;
          color: ${disabled ? "#9ca3af" : "#374151"};
          cursor: ${disabled ? "not-allowed" : "pointer"};
        }
        .nutriwise-phone .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: ${disabled ? "#9ca3af" : "#1f2937"};
          cursor: ${disabled ? "not-allowed" : "text"};
        }
        .nutriwise-phone .PhoneInputInput::placeholder {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}