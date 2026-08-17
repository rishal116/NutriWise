import Image from "next/image";

export function ProgramAvatar({
  userProfileImage,
  userFullName,
}: {
  userProfileImage?: string;
  userFullName: string;
}) {
  if (userProfileImage) {
    return (
      <Image
        src={userProfileImage}
        alt={userFullName}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-xl object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
      {userFullName.charAt(0).toUpperCase()}
    </div>
  );
}
