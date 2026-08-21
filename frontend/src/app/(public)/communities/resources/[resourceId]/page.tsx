"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Bookmark,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Share2,
} from "lucide-react";

import { publicResourceService } from "@/services/public/publicResource.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

import type { PublicResourceDetailsDTO } from "@/dtos/public/resource/public-resource-details.dto";

export default function ResourceDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>();

  const [resource, setResource] = useState<PublicResourceDetailsDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Guards against double-firing recordView in React StrictMode dev double-invoke,
  // and against re-firing if resourceId is somehow the same value re-rendered.
  const viewRecordedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!resourceId) return;

    let cancelled = false;

    const fetchResource = async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await publicResourceService.getResourceDetails(resourceId);
        if (cancelled) return;
        setResource(response.data);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResource();

    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  // Fire-and-forget view tracking, once per resourceId, only after we know it exists.
  useEffect(() => {
    if (!resource || viewRecordedFor.current === resourceId) return;

    viewRecordedFor.current = resourceId;
    publicResourceService.recordView(resourceId).catch(() => {
      // Non-critical: don't surface view-tracking failures to the user.
    });
  }, [resource, resourceId]);

  const handleDownload = async () => {
    if (!resource?.fileUrl || downloading) return;

    setDownloading(true);
    try {
      await publicResourceService.recordDownload(resourceId);
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;

    setSharing(true);
    try {
      await publicResourceService.recordShare(resourceId);

      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({ title: resource?.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      // User cancelling the native share sheet also throws — don't treat that as an error.
      if (err instanceof Error && err.name !== "AbortError") {
        setError(getErrorMessage(err));
      }
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return <ResourceDetailsSkeleton />;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-rose-600">{error}</p>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <FileText size={40} className="mx-auto text-slate-400" />
        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          Resource not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This resource may have been removed or the link is incorrect.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        {resource.thumbnailUrl && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs">
            <Image
              src={resource.thumbnailUrl}
              alt={resource.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {resource.category} · {resource.type.replace("_", " ")}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {resource.title}
        </h1>

        <p className="mt-3 text-slate-600">{resource.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Eye size={16} />
            {resource.viewCount} views
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={16} />
            {resource.bookmarkCount}
          </span>
          {resource.publishedAt && (
            <span>
              Published {new Date(resource.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {resource.isDownloadable && resource.fileUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              {downloading
                ? "Preparing..."
                : `Download (${resource.downloadCount})`}
            </button>
          )}

          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Share2 size={16} />
            Share ({resource.shareCount})
          </button>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
          <ResourceBody resource={resource} />
        </div>
      </article>
    </main>
  );
}

function ResourceBody({ resource }: { resource: PublicResourceDetailsDTO }) {
  switch (resource.type) {
    case "article":
      return resource.content ? (
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
          {resource.content}
        </div>
      ) : (
        <EmptyBody />
      );

    case "infographic":
      return resource.fileUrl ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={resource.fileUrl}
            alt={resource.title}
            fill
            unoptimized
            sizes="768px"
            className="object-contain"
          />
        </div>
      ) : (
        <EmptyBody />
      );

    case "video":
      // Assumption: externalUrl carries an embeddable link (YouTube/Vimeo).
      // Adjust this branch if your videos are always direct file URLs instead.
      if (resource.externalUrl) {
        return (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              src={resource.externalUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      if (resource.fileUrl) {
        return (
          <video controls className="w-full rounded-xl bg-black">
            <source src={resource.fileUrl} />
          </video>
        );
      }
      return <EmptyBody />;

    case "pdf":
      return resource.fileUrl ? (
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-emerald-700 hover:underline"
        >
          <FileText size={18} />
          Open PDF in a new tab
        </a>
      ) : (
        <EmptyBody />
      );

    case "external_link":
      return resource.externalUrl ? (
        <a
          href={resource.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-emerald-700 hover:underline"
        >
          <ExternalLink size={18} />
          Visit external resource
        </a>
      ) : (
        <EmptyBody />
      );

    default:
      return <EmptyBody />;
  }
}

function EmptyBody() {
  return (
    <p className="text-sm text-slate-500">
      No content available for this resource.
    </p>
  );
}

function ResourceDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-3xl animate-pulse px-4 pt-10 sm:px-6">
        <div className="mb-8 aspect-video rounded-2xl bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-3/4 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-full rounded bg-slate-200" />
        <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
        <div className="mt-10 h-64 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}
