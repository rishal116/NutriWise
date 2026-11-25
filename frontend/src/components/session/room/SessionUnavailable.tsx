import Link from "next/link";
import { ArrowLeft, CalendarX } from "lucide-react";

import type { SessionStatus } from "@/constants/common/session.constants";
import { getUnavailableMessage } from "@/components/session/room/session-room.utils";

interface SessionUnavailableProps {
  status: SessionStatus;
  backHref: string;
}

export default function SessionUnavailable({
  status,
  backHref,
}: SessionUnavailableProps) {
  const { title, message } = getUnavailableMessage(status);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0f] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <CalendarX className="h-6 w-6 text-amber-400" />
        </div>

        <h1 className="mt-5 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-gray-400">{message}</p>

        <Link
          href={backHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to session
        </Link>
      </div>
    </div>
  );
}