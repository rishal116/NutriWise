import type { ReactNode } from "react";
import { Hand, MicOff } from "lucide-react";

const AVATAR_COLORS = [
  "bg-purple-700",
  "bg-emerald-700",
  "bg-sky-700",
  "bg-amber-700",
  "bg-rose-700",
  "bg-teal-700",
];

function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return letters || "?";
}

function colorFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface ParticipantTileProps {
  name: string;
  avatarName?: string;
  micOn: boolean;
  cameraOn: boolean;
  raised: boolean;
  children?: ReactNode;
}

export default function ParticipantTile({
  name,
  avatarName,
  micOn,
  cameraOn,
  raised,
  children,
}: ParticipantTileProps) {
  const avatarSource = avatarName || name;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#35363a] sm:rounded-3xl">
      {/* Video stays mounted so remote audio keeps playing with camera off */}
      <div className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-cover">
        {children}
      </div>

      {!cameraOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#35363a]">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-medium text-white sm:h-24 sm:w-24 sm:text-4xl ${colorFor(avatarSource)}`}
          >
            {initialsOf(avatarSource)}
          </div>
        </div>
      )}

      {raised && (
        <span
          role="img"
          aria-label="Hand raised"
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-black shadow"
        >
          <Hand className="h-4 w-4" />
        </span>
      )}

      {!micOn && (
        <span
          role="img"
          aria-label="Microphone off"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
        >
          <MicOff className="h-4 w-4" />
        </span>
      )}

      <div className="absolute bottom-3 left-4 right-4 truncate text-sm font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
        {name}
      </div>
    </div>
  );
}