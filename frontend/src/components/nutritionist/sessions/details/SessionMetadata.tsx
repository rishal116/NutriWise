
import { formatSessionDate } from "./session-details.utils";

interface SessionMetadataProps {
  createdAt: string;
  updatedAt: string;
}

export default function SessionMetadata({
  createdAt,
  updatedAt,
}: SessionMetadataProps) {
  return (
    <div className="flex flex-col gap-1 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:gap-3">
      <span>Created {formatSessionDate(createdAt)}</span>

      <span className="hidden text-slate-300 sm:block">•</span>

      <span>Updated {formatSessionDate(updatedAt)}</span>
    </div>
  );
}
