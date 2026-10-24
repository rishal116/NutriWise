import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import type { ClientDetailsResponseDTO } from "@/dtos/nutritionist/client/client-response.dto";

interface ClientContactCardProps {
  client: ClientDetailsResponseDTO;
}

function formatDate(value?: string): string {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ClientContactCard({
  client,
}: ClientContactCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Contact information
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Personal details available for this client.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ContactItem
          icon={<Mail size={17} aria-hidden="true" />}
          label="Email address"
          value={client.email || "Not provided"}
        />

        <ContactItem
          icon={<Phone size={17} aria-hidden="true" />}
          label="Phone number"
          value={client.phone?.trim() || "Not provided"}
        />

        <ContactItem
          icon={<UserRound size={17} aria-hidden="true" />}
          label="Gender"
          value={client.gender?.trim() || "Not provided"}
        />

        <ContactItem
          icon={<CalendarDays size={17} aria-hidden="true" />}
          label="Date of birth"
          value={formatDate(client.birthDate)}
        />
      </div>
    </section>
  );
}