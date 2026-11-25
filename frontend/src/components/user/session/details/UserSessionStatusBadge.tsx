interface UserSessionStatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  registered: "bg-emerald-50 text-emerald-700",
  attended: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  absent: "bg-red-50 text-red-700",
  live: "bg-red-100 text-red-700",
};

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function UserSessionStatusBadge({
  status,
}: UserSessionStatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}