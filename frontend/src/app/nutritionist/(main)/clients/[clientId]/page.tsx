"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ClientDetailsResponseDTO } from "@/dtos/nutritionist/client/client-response.dto";
import { nutriClientService } from "@/services/nutritionist/nutri-client.service";

import ClientContactCard from "@/components/nutritionist/client-details/ClientContactCard";
import ClientDetailsEmptyState from "@/components/nutritionist/client-details/ClientDetailsEmptyState";
import ClientDetailsHeader from "@/components/nutritionist/client-details/ClientDetailsHeader";
import ClientDetailsSkeleton from "@/components/nutritionist/client-details/ClientDetailsSkeleton";
import ClientHealthCard from "@/components/nutritionist/client-details/ClientHealthCard";
import ClientProgramCard from "@/components/nutritionist/client-details/ClientProgramCard";

export default function ClientDetailsPage() {
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const clientId = params.clientId;

  const [client, setClient] = useState<ClientDetailsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const goBack = useCallback(() => {
    router.push("/nutritionist/clients");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function loadClient() {
      if (!clientId) {
        setClient(null);
        setLoadError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(false);
      setClient(null);

      try {
        const response = await nutriClientService.getClientDetails(clientId);

        if (cancelled) return;

        setClient(response);
      } catch {
        if (cancelled) return;

        setLoadError(true);
        toast.error("Couldn't load this client's details.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadClient();

    return () => {
      cancelled = true;
    };
  }, [clientId, retryCount]);

  return (
    <main className="min-h-screen bg-slate-50/80 pb-12">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <ClientDetailsSkeleton />
        ) : loadError || !client ? (
          <ClientDetailsEmptyState
            error={loadError}
            onBack={goBack}
            onRetry={() => setRetryCount((current) => current + 1)}
          />
        ) : (
          <>
            <ClientDetailsHeader client={client} onBack={goBack} />

            <div className="grid items-start gap-5 lg:grid-cols-2">
              <ClientContactCard client={client} />
              <ClientHealthCard health={client.health} />
            </div>

            <section className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Nutrition programs
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review program status, progress, and scheduled dates.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {client.programs.length}{" "}
                  {client.programs.length === 1 ? "program" : "programs"}
                </span>
              </div>

              {client.programs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    No programs assigned yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    This client does not have any programs to display.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {client.programs.map((program) => (
                    <ClientProgramCard
                      key={program.userProgramId}
                      clientId={client.clientId}
                      program={program}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
