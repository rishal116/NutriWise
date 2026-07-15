"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import ProfileImageUploader from "@/components/common/ProfileImageUploader";
import Toast from "@/components/common/Toast";
import { userProfileService } from "@/services/user/userProfile.service";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { GetUserProfileDto } from "@/dtos/user/profile/get-user-profile.dto";
import { UpdateUserProfileDto } from "@/dtos/user/profile/update-user-profile.dto";
import { Gender } from "@/enums/user/user.enum";

interface ToastState {
  message: string;
  type: "success" | "error";
}

function toDateInputValue(date?: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function toFormState(profile: GetUserProfileDto): UpdateUserProfileDto {
  return {
    fullName: profile.fullName,
    phone: profile.phone,
    gender: profile.gender,
    birthDate: toDateInputValue(profile.birthDate),
  };
}

export default function AccountPage() {
  const [user, setUser] = useState<GetUserProfileDto | null>(null);
  const [form, setForm] = useState<UpdateUserProfileDto>({
    fullName: "",
    phone: "",
    gender: undefined,
    birthDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingForm, setEditingForm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await userProfileService.getProfile();
        setUser(profile);
        setForm(toFormState(profile));
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateAge = (birthDate?: string | Date): string => {
    if (!birthDate) return "—";
    const diffMs = Date.now() - new Date(birthDate).getTime();
    return `${Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))} yrs`;
  };

  const phoneError = !!form.phone && !isValidPhoneNumber(form.phone);

  const handleSaveForm = async () => {
    if (phoneError) return;
    setSaving(true);
    try {
      const updatedProfile = await userProfileService.updateProfile(form);
      setUser(updatedProfile);
      setForm(toFormState(updatedProfile));
      setEditingForm(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch {
      setToast({ message: "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) setForm(toFormState(user));
    setEditingForm(false);
  };

  if (loading || !user) {
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
      {/* PAGE HEADER */}
      <div className="bg-emerald-600 rounded-2xl px-7 py-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-1">
          Ac Settings
        </h1>
        <p className="text-emerald-50 text-sm font-medium">
          Manage your profile information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT — PROFILE CARD */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-5">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-sm opacity-25" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={user.profileImage || "/images/images.jpg"}
                  alt={user.fullName}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => setShowImageCropper(true)}
                className="absolute bottom-1 right-1 w-9 h-9 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                aria-label="Change profile picture"
              >
                <Camera size={15} />
              </button>
            </div>

            <div className="text-center mb-5">
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                {user.fullName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                <ShieldCheck size={12} />
                Verified Account
              </span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                <div className="bg-emerald-100 p-1.5 rounded-lg flex-shrink-0">
                  <Mail size={13} className="text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                  <div className="bg-teal-100 p-1.5 rounded-lg flex-shrink-0">
                    <Phone size={13} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}

              {user.birthDate && (
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                  <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0">
                    <Calendar size={13} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      Age
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {calculateAge(user.birthDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              <X size={14} className="flex-shrink-0" />
              Cancel Edit
            </button>
          )}
        </div>

        {/* RIGHT — FORM */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Personal Information
                </h3>
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
                  value={form.fullName ?? ""}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<User size={13} className="text-emerald-600" />}
                  required
                />

                <PhoneField
                  value={form.phone ?? ""}
                  onChange={(phone: string) =>
                    setForm((prev) => ({ ...prev, phone }))
                  }
                  error={phoneError}
                  disabled={!editingForm}
                />

                <FieldInput
                  label="Birthdate"
                  name="birthDate"
                  type="date"
                  value={form.birthDate ?? ""}
                  onChange={handleChange}
                  disabled={!editingForm}
                  icon={<Calendar size={13} className="text-emerald-600" />}
                />

                <GenderSelect
                  value={form.gender ?? ""}
                  onChange={handleChange}
                  disabled={!editingForm}
                />

                <FieldInput
                  label="Age"
                  value={calculateAge(form.birthDate)}
                  disabled
                  icon={<User size={13} className="text-slate-400" />}
                />

                <FieldInput
                  label="Email"
                  value={user.email}
                  disabled
                  icon={<Mail size={13} className="text-slate-400" />}
                />
              </div>

              {editingForm && (
                <div className="pt-5 border-t border-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveForm}
                    disabled={phoneError || saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-emerald-100 hover:shadow-md transition-all disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin flex-shrink-0"
                        />
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

      {showImageCropper && (
        <ProfileImageUploader
          onClose={() => setShowImageCropper(false)}
          uploadImage={userProfileService.uploadProfileImage}
          onUploadSuccess={(newUrl: string) => {
            setUser((prev) =>
              prev ? { ...prev, profileImage: newUrl } : prev,
            );
            setToast({
              message: "Image updated successfully!",
              type: "success",
            });
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

/* FIELD INPUT */
interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: boolean;
}

function FieldInput({
  label,
  icon,
  error,
  disabled,
  ...rest
}: FieldInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
        {icon}
        {label}
        {rest.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        {...rest}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
        } ${
          disabled
            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
            : "bg-white text-slate-800"
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

/* GENDER SELECT */
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
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
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
            ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
            : "bg-white text-slate-800 border-slate-200"
        }`}
      >
        <option value="">Select gender</option>
        <option value={Gender.MALE}>Male</option>
        <option value={Gender.FEMALE}>Female</option>
        <option value={Gender.OTHER}>Other</option>
        <option value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</option>
      </select>
    </div>
  );
}

/* PHONE FIELD */
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
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
        <Phone size={13} className="text-emerald-600" />
        Phone Number
      </label>
      <div
        className={`phone-wrap rounded-xl border transition-all ${
          error ? "border-red-300" : "border-slate-200"
        } ${disabled ? "bg-slate-50" : "bg-white"}`}
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
          color: ${disabled ? "#94a3b8" : "#334155"};
          cursor: ${disabled ? "not-allowed" : "pointer"};
        }
        .nutriwise-phone .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: ${disabled ? "#94a3b8" : "#1e293b"};
          cursor: ${disabled ? "not-allowed" : "text"};
        }
        .nutriwise-phone .PhoneInputInput::placeholder {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
