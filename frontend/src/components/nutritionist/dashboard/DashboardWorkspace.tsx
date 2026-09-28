import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  MessageCircle,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

interface WorkspaceItem {
  title: string;
  description: string;
  href: string;
  icon: typeof Users;
}

const WORKSPACE_ITEMS: WorkspaceItem[] = [
  {
    title: "Clients",
    description: "Manage your coaching clients",
    href: "/nutritionist/clients",
    icon: Users,
  },
  {
    title: "Coaching plans",
    description: "Create and manage plans",
    href: "/nutritionist/plans",
    icon: BookOpen,
  },
  {
    title: "Programs",
    description: "Track client programs",
    href: "/nutritionist/programs",
    icon: FileText,
  },
  {
    title: "Groups",
    description: "Manage coaching groups",
    href: "/nutritionist/groups",
    icon: UsersRound,
  },
  {
    title: "Sessions",
    description: "Schedule and manage sessions",
    href: "/nutritionist/sessions",
    icon: CalendarDays,
  },
  {
    title: "Resources",
    description: "Publish educational content",
    href: "/nutritionist/resources",
    icon: MessageCircle,
  },
];

export default function DashboardWorkspace() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Your workspace
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Jump directly into the tools you use most.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WORKSPACE_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {item.description}
                </p>
              </div>

              <ArrowUpRight
                size={15}
                className="shrink-0 text-slate-300 transition-colors group-hover:text-emerald-500"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}