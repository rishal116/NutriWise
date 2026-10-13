"use client";

import { useCallback, useEffect, useState } from "react";
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
  UserX,
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

const EMPTY_FORM: UpdateUserProfileDto = {
  fullName: "",
  phone: "",
  gender: undefined,
  birthDate: "",
};

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

function calculateAge(birthDate?: string | Date): string {
  if (!birthDate) return "—";
  const diffMs = Date.now() - new Date(birthDate).getTime();
  return `${Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))} yrs`;
}

export default function AccountPage() {
  const [user, setUser] = useState<GetUserProfileDto | null>(null);
  const [form, setForm] = useState<UpdateUserProfileDto>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingForm, setEditingForm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const profile = await userProfileService.getProfile();
      setUser(profile);
      setForm(toFormState(profile));
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-emerald-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Account Settings
        </h1>
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : isError || !user ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <UserX className="h-6 w-6 text-rose-700" />
          </div>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
            Couldn&apos;t load your profile
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={fetchProfile}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* LEFT — PROFILE CARD */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="relative mx-auto mb-5 h-28 w-28 sm:h-32 sm:w-32">
                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-md ring-1 ring-slate-200">
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
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-colors hover:bg-emerald-700"
                  aria-label="Change profile picture"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="mb-5 text-center">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {user.fullName}
                </h2>
                <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <ShieldCheck size={12} />
                  Verified Account
                </span>
              </div>

              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <InfoRow
                  icon={<Mail size={13} className="text-emerald-600" />}
                  label="Email"
                  value={user.email}
                />
                {user.phone && (
                  <InfoRow
                    icon={<Phone size={13} className="text-emerald-600" />}
                    label="Phone"
                    value={user.phone}
                  />
                )}
                {user.birthDate && (
                  <InfoRow
                    icon={<Calendar size={13} className="text-emerald-600" />}
                    label="Age"
                    value={calculateAge(user.birthDate)}
                  />
                )}
              </div>
            </div>

            {!editingForm ? (
              <button
                onClick={() => setEditingForm(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                <Pencil size={14} className="flex-shrink-0" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancelEdit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
              >
                <X size={14} className="flex-shrink-0" />
                Cancel Edit
              </button>
            )}
          </div>

          {/* RIGHT — FORM */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">
                    Personal Information
                  </h3>
                </div>
                {editingForm && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    Editing
                  </span>
                )}
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <div className="flex flex-col items-stretch justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveForm}
                      disabled={phoneError || saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      {saving ? (
                        <>
                          <Loader2
                            size={15}
                            className="flex-shrink-0 animate-spin"
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
      )}

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

/* SKELETON */
function ProfileSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mx-auto mb-5 h-32 w-32 rounded-full bg-slate-100" />
          <div className="mx-auto mb-2 h-5 w-40 rounded bg-slate-100" />
          <div className="mx-auto mb-5 h-5 w-32 rounded-full bg-slate-100" />
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <div className="h-14 rounded-xl bg-slate-50" />
            <div className="h-14 rounded-xl bg-slate-50" />
          </div>
        </div>
        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="lg:col-span-8">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 h-5 w-48 rounded bg-slate-100" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-slate-100" />
                <div className="h-10 rounded-xl bg-slate-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* INFO ROW */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
      <div className="flex-shrink-0 rounded-lg bg-emerald-50 p-1.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

/* FIELD LABEL */
function FieldLabel({
  icon,
  children,
  required,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {icon}
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
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
      <FieldLabel icon={icon} required={rest.required}>
        {label}
      </FieldLabel>
      <input
        {...rest}
        disabled={disabled}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-300 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
        } ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "bg-white text-slate-900"
        }`}
      />
      {error && (
        <p className="text-[11px] font-medium text-rose-600">
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
      <FieldLabel icon={<User size={13} className="text-emerald-600" />}>
        Gender
      </FieldLabel>
      <select
        name="gender"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "bg-white text-slate-900"
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
      <FieldLabel icon={<Phone size={13} className="text-emerald-600" />}>
        Phone Number
      </FieldLabel>
      <div
        className={`rounded-xl border transition-all focus-within:ring-2 ${
          error
            ? "border-rose-300 focus-within:ring-rose-100"
            : "border-slate-200 focus-within:border-emerald-400 focus-within:ring-emerald-100"
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
        <p className="text-[11px] font-medium text-rose-600">
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
          color: ${disabled ? "#94a3b8" : "#0f172a"};
          cursor: ${disabled ? "not-allowed" : "text"};
        }
        .nutriwise-phone .PhoneInputInput::placeholder {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
