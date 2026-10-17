"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Languages,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { nutritionistCredentialsService } from "@/services/nutritionist/nutriCredentials.service";
import type { NutritionistCredentialsDTO } from "@/dtos/nutritionist/credentials/nutritionist-credentials.dto";

const cardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

function SectionTitle({
  icon: Icon,
  title,
  count,
}: {
  icon: typeof Award;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>

      {count !== undefined && (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
      {message}
    </p>
  );
}

export default function NutritionistCredentialsPage() {
  const [credentials, setCredentials] =
    useState<NutritionistCredentialsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCredentials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await nutritionistCredentialsService.getCredentials();
      setCredentials(data);
    } catch {
      setError("Unable to load your professional credentials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCredentials();
  }, [loadCredentials]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          Loading your credentials...
        </div>
      </div>
    );
  }

  if (error || !credentials) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Award size={26} />
        </div>

        <h1 className="text-xl font-semibold text-slate-900">
          Credentials unavailable
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {error ?? "No credentials were returned for your account."}
        </p>

        <button
          type="button"
          onClick={() => void loadCredentials()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  const initials = credentials.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-emerald-700">
          Nutritionist workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Professional credentials
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Review your qualifications, certifications, experience, and
          professional profile information.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="h-2 bg-emerald-600" />

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          {credentials.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={credentials.profileImage}
              alt={credentials.fullName}
              className="size-20 rounded-2xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-800">
              {initials || "N"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {credentials.fullName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 size={14} />
                Approved profile
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              @{credentials.username}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {credentials.bio || "No professional bio added yet."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 sm:self-center">
            <Star size={17} className="fill-amber-400 text-amber-500" />
            {credentials.rating.toFixed(1)}
            <span className="font-normal text-amber-700">
              ({credentials.totalReviews} reviews)
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total experience</p>
            <BriefcaseBusiness size={19} className="text-emerald-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {credentials.totalExperienceYears}
            <span className="ml-2 text-sm font-medium text-slate-500">
              years
            </span>
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Qualifications</p>
            <GraduationCap size={19} className="text-emerald-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {credentials.qualifications.length}
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Certifications</p>
            <Award size={19} className="text-emerald-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {credentials.certifications.length}
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">People coached</p>
            <Users size={19} className="text-emerald-700" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {credentials.totalPeopleCoached}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <SectionTitle
            icon={GraduationCap}
            title="Educational qualifications"
            count={credentials.qualifications.length}
          />

          {credentials.qualifications.length === 0 ? (
            <EmptySection message="No qualifications available." />
          ) : (
            <div className="space-y-4">
              {credentials.qualifications.map((qualification, index) => (
                <div
                  key={`${qualification.degree}-${qualification.institution}-${index}`}
                  className="flex gap-3"
                >
                  <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <GraduationCap size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {qualification.degree}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {qualification.institution}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={13} />
                      {qualification.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <SectionTitle
            icon={BriefcaseBusiness}
            title="Work experience"
            count={credentials.experiences.length}
          />

          {credentials.experiences.length === 0 ? (
            <EmptySection message="No work experience available." />
          ) : (
            <div className="space-y-4">
              {credentials.experiences.map((experience, index) => (
                <div
                  key={`${experience.role}-${experience.organization}-${index}`}
                  className="flex gap-3"
                >
                  <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <BriefcaseBusiness size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {experience.role}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {experience.organization}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {experience.durationYears}{" "}
                      {experience.durationYears === 1 ? "year" : "years"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <SectionTitle
            icon={Award}
            title="Certifications"
            count={credentials.certifications.length}
          />

          {credentials.certifications.length === 0 ? (
            <EmptySection message="No certifications available." />
          ) : (
            <div className="space-y-3">
              {credentials.certifications.map((certification, index) => (
                <div
                  key={`${certification.name}-${certification.issuedBy}-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <ShieldCheck size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {certification.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Issued by {certification.issuedBy}
                      </p>

                      {certification.certificateUrl && (
                        <a
                          href={certification.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                          View certificate
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <SectionTitle icon={ShieldCheck} title="Professional details" />

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Coach level
              </p>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium capitalize text-emerald-800">
                {credentials.coachLevel.replace(/[_-]/g, " ")}
              </span>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Specializations
              </p>
              {credentials.specializations.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No specializations available.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {credentials.specializations.map((specialization) => (
                    <span
                      key={specialization}
                      className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm capitalize text-emerald-800"
                    >
                      {specialization.replace(/[_-]/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Languages size={16} />
                Languages
              </p>
              {credentials.languages.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No languages available.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {credentials.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
