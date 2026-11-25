import type { PublicSessionListItemResponseDTO } from "@/dtos/public/session/public-session-list-response.dto";
import SessionCard from "./SessionCard";

interface SessionGridProps {
  sessions: PublicSessionListItemResponseDTO[];
}

export default function SessionGrid({ sessions }: SessionGridProps) {
  return (
    <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.sessionId} session={session} />
      ))}
    </div>
  );
}
