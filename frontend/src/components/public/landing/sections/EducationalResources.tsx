
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Image as ImageIcon,
  PlayCircle,
} from "lucide-react";

import type { PublicHomeResourceDTO } from "@/dtos/public/home/public-home-resource.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection";

function ResourceCard({
  resource,
}: {
  resource: PublicHomeResourceDTO;
}) {
  const resourceIcons = {
    article: BookOpen,
    pdf: FileText,
    video: PlayCircle,
    infographic: ImageIcon,
  };

  const Icon =
    resourceIcons[resource.type as keyof typeof resourceIcons] ?? BookOpen;

  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
        <Icon size={23} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold capitalize text-teal-700">
          {resource.type}
        </span>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
          {resource.category}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        {resource.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
        {resource.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-500">
          <p>By {resource.author.fullName}</p>
          <p className="mt-1">
            {resource.viewCount.toLocaleString()} views
          </p>
        </div>

        <Link
          href="/communities/resources"
          aria-label={`Explore ${resource.title}`}
          className="rounded-full bg-emerald-50 p-2.5 text-emerald-700 transition hover:bg-emerald-100"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}

export default function EducationalResources() {
  return (
    <HomepageDataSection
      eyebrow="Knowledge for better health"
      title="Explore educational resources"
      description="Discover practical articles, videos, and guides to make informed wellness decisions."
      href="/communities/resources"
      fetchData={publicHomepageService.getLatestResources}
      renderItem={(resource) => <ResourceCard resource={resource} />}
    />
  );
}
