"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import {
  Camera,
  Calendar,
  Mail,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserX,
  X,
  Loader2,
} from "lucide-react";

import ProfileImageUploader from "@/components/common/ProfileImageUploader";
import { toast } from "sonner";

import { userProfileService } from "@/services/user/userProfile.service";

import type { GetUserProfileDto } from "@/dtos/user/profile/get-user-profile.dto";
import type { UpdateUserProfileDto } from "@/dtos/user/profile/update-user-profile.dto";

import { ProfileInfoRow } from "./ProfileInfoRow";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { ProfileFieldInput } from "./ProfileFieldInput";
import { ProfileGenderSelect } from "./ProfileGenderSelect";
import { ProfilePhoneField } from "./ProfilePhoneField";
import { calculateAge, toFormState } from "./profile.utils";
import { getErrorMessage } from "@/utils/getErrorMessage";

const EMPTY_FORM: UpdateUserProfileDto = {
  fullName: "",
  phone: "",
  gender: undefined,
  birthDate: "",
};

const CARD_CLASS =
  "rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5";

const PRIMARY_BUTTON_CLASS =
  "bg-admin-accent text-admin-accent-fg transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

const SECONDARY_BUTTON_CLASS =
  "bg-admin-surface-hover text-admin-muted transition-colors hover:bg-admin-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

export default function AdminProfile() {
  const [user, setUser] = useState<GetUserProfileDto | null>(null);
  const [form, setForm] = useState<UpdateUserProfileDto>(EMPTY_FORM);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingForm, setEditingForm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const profile = await userProfileService.getProfile();

      setUser(profile);
      setForm(toFormState(profile));
    } catch (error: unknown) {
      setIsError(true);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const phoneError = Boolean(form.phone && !/^[6-9]\d{9}$/.test(form.phone));

  const handleSaveForm = async () => {
    if (phoneError || saving) return;

    setSaving(true);

    try {
      const updatedProfile = await userProfileService.updateProfile(form);

      setUser(updatedProfile);
      setForm(toFormState(updatedProfile));
      setEditingForm(false);

      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setForm(toFormState(user));
    }

    setEditingForm(false);
  };

  const handleImageUploadSuccess = (newUrl: string) => {
    setUser((previous) =>
      previous ? { ...previous, profileImage: newUrl } : previous,
    );

    setShowImageCropper(false);

    toast.success("Profile image updated successfully!");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-admin-accent" />
        <h1 className="text-2xl font-bold text-admin-text">Admin Profile</h1>
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : isError || !user ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-admin-danger/30 bg-admin-danger-soft py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-danger/15">
            <UserX className="h-6 w-6 text-admin-danger" />
          </div>

          <h2 className="mt-4 text-lg font-bold tracking-tight text-admin-text">
            Couldn&apos;t load your profile
          </h2>

          <p className="mt-1 text-xs font-medium text-admin-muted">
            Something went wrong. Please try again.
          </p>

          <button
            type="button"
            onClick={() => void fetchProfile()}
            className={`mt-5 rounded-xl px-5 py-2.5 text-sm font-bold ${PRIMARY_BUTTON_CLASS}`}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* Profile card */}
          <div className="space-y-4 lg:col-span-4">
            <div className={`${CARD_CLASS} p-6`}>
              <div className="relative mx-auto mb-5 h-28 w-28 sm:h-32 sm:w-32">
                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-admin-surface shadow-md ring-1 ring-admin-border">
                  <Image
                    src={user.profileImage || "/images/images.jpg"}
                    alt={user.fullName}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowImageCropper(true)}
                  aria-label="Change profile picture"
                  className={`absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full shadow-md ${PRIMARY_BUTTON_CLASS}`}
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="mb-5 text-center">
                <h2 className="text-lg font-bold tracking-tight text-admin-text">
                  {user.fullName}
                </h2>

                <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-admin-border bg-admin-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-admin-accent">
                  <ShieldCheck size={12} />
                  Verified Account
                </span>
              </div>

              <div className="space-y-2.5 border-t border-admin-border pt-4">
                <ProfileInfoRow
                  icon={<Mail size={13} className="text-admin-accent" />}
                  label="Email"
                  value={user.email}
                />

                {user.phone && (
                  <ProfileInfoRow
                    icon={<Phone size={13} className="text-admin-accent" />}
                    label="Phone"
                    value={user.phone}
                  />
                )}

                {user.birthDate && (
                  <ProfileInfoRow
                    icon={<Calendar size={13} className="text-admin-accent" />}
                    label="Age"
                    value={calculateAge(user.birthDate)}
                  />
                )}
              </div>
            </div>

            {!editingForm ? (
              <button
                type="button"
                onClick={() => setEditingForm(true)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold ${PRIMARY_BUTTON_CLASS}`}
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold ${SECONDARY_BUTTON_CLASS}`}
              >
                <X size={14} />
                Cancel Edit
              </button>
            )}
          </div>

          {/* Personal information */}
          <div className="lg:col-span-8">
            <div className={`${CARD_CLASS} overflow-hidden`}>
              <div className="flex items-center justify-between gap-3 border-b border-admin-border px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-1 rounded-full bg-admin-accent" />
                  <h3 className="text-lg font-bold tracking-tight text-admin-text">
                    Personal Information
                  </h3>
                </div>

                {editingForm && (
                  <span className="rounded-full bg-admin-accent-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-admin-accent">
                    Editing
                  </span>
                )}
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProfileFieldInput
                    label="Full Name"
                    name="fullName"
                    value={form.fullName ?? ""}
                    onChange={handleChange}
                    disabled={!editingForm}
                    icon={<User size={13} className="text-admin-accent" />}
                    required
                  />

                  <ProfilePhoneField
                    value={form.phone ?? ""}
                    onChange={(phone) =>
                      setForm((previous) => ({ ...previous, phone }))
                    }
                    error={phoneError}
                    disabled={!editingForm}
                  />

                  <ProfileFieldInput
                    label="Birthdate"
                    name="birthDate"
                    type="date"
                    value={form.birthDate ?? ""}
                    onChange={handleChange}
                    disabled={!editingForm}
                    icon={<Calendar size={13} className="text-admin-accent" />}
                  />

                  <ProfileGenderSelect
                    value={form.gender ?? ""}
                    onChange={handleChange}
                    disabled={!editingForm}
                  />

                  <ProfileFieldInput
                    label="Age"
                    value={calculateAge(form.birthDate)}
                    disabled
                    icon={<User size={13} className="text-admin-muted" />}
                  />

                  <ProfileFieldInput
                    label="Email"
                    value={user.email}
                    disabled
                    icon={<Mail size={13} className="text-admin-muted" />}
                  />
                </div>

                {editingForm && (
                  <div className="flex flex-col items-stretch justify-end gap-3 border-t border-admin-border pt-5 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className={`rounded-xl px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${SECONDARY_BUTTON_CLASS}`}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleSaveForm()}
                      disabled={phoneError || saving}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:bg-admin-border disabled:text-admin-muted ${PRIMARY_BUTTON_CLASS}`}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save size={15} />
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
          onUploadSuccess={handleImageUploadSuccess}
        />
      )}
    </div>
  );
}