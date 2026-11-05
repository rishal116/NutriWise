import type { GetUserProfileDto } from "@/dtos/user/profile/get-user-profile.dto";
import type { UpdateUserProfileDto } from "@/dtos/user/profile/update-user-profile.dto";

export function toDateInputValue(date?: string | Date): string {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().split("T")[0];
}

export function toFormState(profile: GetUserProfileDto): UpdateUserProfileDto {
  return {
    fullName: profile.fullName,
    phone: profile.phone,
    gender: profile.gender,
    birthDate: toDateInputValue(profile.birthDate),
  };
}

export function calculateAge(birthDate?: string | Date): string {
  if (!birthDate) return "—";

  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) return "—";

  const today = new Date();

  let age = today.getFullYear() - date.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

  if (!hasBirthdayPassed) age--;

  return age >= 0 ? `${age} yrs` : "—";
}
