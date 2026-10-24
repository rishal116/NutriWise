import Image from "next/image";
import type { ClientListItemDTO } from "@/dtos/nutritionist/client/client-response.dto";

interface ClientAvatarProps {
  client: Pick<ClientListItemDTO, "fullName" | "profileImage">;
  size?: "sm" | "md" | "lg";
}

const SIZE_STYLES = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-14 w-14 text-lg",
} as const;

export default function ClientAvatar({
  client,
  size = "md",
}: ClientAvatarProps) {
  const sizeClass = SIZE_STYLES[size];
  const initial = client.fullName.trim().charAt(0).toUpperCase() || "?";

  if (client.profileImage) {
    return (
      <Image
        src={client.profileImage}
        alt={`${client.fullName}'s profile`}
        width={56}
        height={56}
        className={`${sizeClass} shrink-0 rounded-2xl object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={`${client.fullName}'s avatar`}
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800 ${sizeClass}`}
    >
      {initial}
    </div>
  );
}