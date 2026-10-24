import Image from "next/image";

import { getInitials } from "./user-table.utils";

interface UserAvatarProps {
  fullName: string;
  src?: string | null;
}

export default function UserAvatar({ fullName, src }: UserAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={fullName}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-emerald-50 text-xs font-bold text-emerald-600">
      {getInitials(fullName)}
    </div>
  );
}