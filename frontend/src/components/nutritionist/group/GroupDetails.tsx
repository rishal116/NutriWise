"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Globe2,
  Lock,
  Pencil,
  Users,
} from "lucide-react";
import type { GroupDetailsDTO } from "@/dtos/nutritionist/group/group-details.dto";
interface GroupDetailsProps {
  group: GroupDetailsDTO;
}
const STATUS_STYLES: Record<GroupDetailsDTO["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  inactive: "bg-slate-50 text-slate-600 border-slate-200",
  blocked: "bg-amber-50 text-amber-700 border-amber-100",
  closed: "bg-rose-50 text-rose-700 border-rose-100",
};
const STATUS_LABELS: Record<GroupDetailsDTO["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  blocked: "Blocked",
  closed: "Closed",
};
function getInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase() || "G";
}
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
export default function GroupDetails({ group }: GroupDetailsProps) {
  const [copied, setCopied] = useState(false);
  const isPrivate = group.visibility === "private";
  const inviteLink =
    isPrivate && group.inviteToken
      ? `${window.location.origin}/groups/join/${group.inviteToken}`
      : "";
  const handleCopyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="space-y-6 pb-12">
      {" "}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {" "}
        <div className="flex items-start gap-4">
          {" "}
          <Link
            href="/nutritionist/groups"
            className="group mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-emerald-200 hover:text-emerald-600"
            aria-label="Back to groups"
          >
            {" "}
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />{" "}
          </Link>{" "}
          <div>
            {" "}
            <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-400">
              {" "}
              <Link
                href="/nutritionist/groups"
                className="transition hover:text-emerald-600"
              >
                {" "}
                Groups{" "}
              </Link>{" "}
              <span>/</span>{" "}
              <span className="font-medium text-slate-600"> Details </span>{" "}
            </div>{" "}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {" "}
              {group.title}{" "}
            </h1>{" "}
          </div>{" "}
        </div>{" "}
        <button
          type="button"
          disabled
          className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-400"
          title="Group editing will be added later"
        >
          {" "}
          <Pencil size={15} /> Edit Group{" "}
        </button>{" "}
      </div>{" "}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {" "}
        <div className="relative h-56 bg-emerald-50 sm:h-72">
          {" "}
          {group.groupAvatar ? (
            <Image
              src={group.groupAvatar}
              alt={group.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-emerald-50">
              {" "}
              <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-600 text-4xl font-bold text-white shadow-sm">
                {" "}
                {getInitial(group.title)}{" "}
              </span>{" "}
            </div>
          )}{" "}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/60 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
            {" "}
            <div className="flex flex-wrap items-center gap-2">
              {" "}
              <span
                className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[group.status]}`}
              >
                {" "}
                {STATUS_LABELS[group.status]}{" "}
              </span>{" "}
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                {" "}
                {isPrivate ? <Lock size={11} /> : <Globe2 size={11} />}{" "}
                {isPrivate ? "Private group" : "Public group"}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px] lg:p-8">
          {" "}
          <div className="space-y-6">
            {" "}
            <div>
              {" "}
              <h2 className="text-lg font-bold text-slate-900">
                {" "}
                About this group{" "}
              </h2>{" "}
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {" "}
                {group.description ||
                  "No description has been added to this group yet."}{" "}
              </p>{" "}
            </div>{" "}
            {isPrivate && group.inviteToken && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                {" "}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {" "}
                  <div className="min-w-0">
                    {" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                        {" "}
                        <Lock size={16} />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <h2 className="text-sm font-bold text-slate-900">
                          {" "}
                          Private group invite{" "}
                        </h2>{" "}
                        <p className="mt-0.5 text-xs text-slate-500">
                          {" "}
                          Share this link with people you want to invite.{" "}
                        </p>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-white px-3 py-3">
                      {" "}
                      <p className="break-all text-xs font-medium leading-5 text-slate-600">
                        {" "}
                        {inviteLink}{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    onClick={handleCopyInvite}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {" "}
                    {copied ? (
                      <>
                        {" "}
                        <Check size={15} /> Copied{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <Copy size={15} /> Copy link{" "}
                      </>
                    )}{" "}
                  </button>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
          <aside className="space-y-3 lg:border-l lg:border-slate-100 lg:pl-6">
            {" "}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  {" "}
                  <Users size={17} />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    {" "}
                    Members{" "}
                  </p>{" "}
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {" "}
                    {group.memberCount}{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              {" "}
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {" "}
                Created{" "}
              </p>{" "}
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {" "}
                {formatDate(group.createdAt)}{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              {" "}
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {" "}
                Last updated{" "}
              </p>{" "}
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {" "}
                {formatDate(group.updatedAt)}{" "}
              </p>{" "}
            </div>{" "}
          </aside>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
