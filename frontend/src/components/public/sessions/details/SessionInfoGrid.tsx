
import {
  CalendarDays,
  Clock,
  Timer,
  Users,
} from "lucide-react";

import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";

import SessionInfoCard from "./SessionInfoCard";

interface SessionInfoGridProps {
  session: PublicSessionDetailsResponseDTO;
}

export default function SessionInfoGrid({
  session,
}: SessionInfoGridProps) {
  const scheduledDate = new Date(session.scheduledAt);

  const formattedDate = scheduledDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const infoItems = [
    {
      icon: CalendarDays,
      label: "Date",
      value: formattedDate,
    },
    {
      icon: Clock,
      label: "Time",
      value: formattedTime,
    },
    {
      icon: Timer,
      label: "Duration",
      value: `${session.duration} minutes`,
    },
    {
      icon: Users,
      label: "Maximum participants",
      value: `${session.maxParticipants} participants`,
    },
  ];

  return (
    <section
      aria-label="Session details"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
    >
      {infoItems.map((item) => (
        <SessionInfoCard key={item.label} {...item} />
      ))}
    </section>
  );
}
