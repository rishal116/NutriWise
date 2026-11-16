"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { nutritionistPlanBrowsingService } from "@/services/user/nutriPanBrowsing.service";
import { checkoutService } from "@/services/user/checkout.service";
import type { NutritionistPlanDTO } from "@/dtos/user/nutri-plan-browsing/nutri-plan.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

import CheckoutHeader from "./CheckoutHeader";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutPaymentPanel from "./CheckoutPaymentPanel";
import CheckoutLoading from "./CheckoutLoading";
import CheckoutError from "./CheckoutError";

const ClientSatisfactionBanner = dynamic(
  () => import("./ClientSatisfactionBanner"),
  {
    loading: () => null,
  },
);

interface CheckoutClientProps {
  slug: string | null;
}

export default function CheckoutClient({ slug }: CheckoutClientProps) {
  const router = useRouter();

  const [plan, setPlan] = useState<NutritionistPlanDTO | null>(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPlan, setFetchingPlan] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPlan = async () => {
      if (!slug) {
        toast.error("Plan information is missing.");
        setFetchingPlan(false);
        return;
      }

      try {
        const response =
          await nutritionistPlanBrowsingService.getPlanBySlug(slug);

        if (!isMounted) return;

        if (!response) {
          toast.error("Plan not found.");
          return;
        }

        setPlan(response);
      } catch (error) {
        if (!isMounted) return;

        toast.error(getErrorMessage(error) || "Failed to load plan details.");
      } finally {
        if (isMounted) {
          setFetchingPlan(false);
        }
      }
    };

    void fetchPlan();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleCheckout = async () => {
    if (!agree || !plan || loading) return;

    try {
      setLoading(true);

      const response = await checkoutService.createSession({
        planId: plan.id,
      });

      if (!response.success || !response.data.checkoutUrl) {
        throw new Error("Checkout URL missing.");
      }

      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error("Checkout initialization failed:", error);

      toast.error(
        getErrorMessage(error) ||
          "Payment initialization failed. Please try again.",
      );

      setLoading(false);
    }
  };

  if (fetchingPlan) {
    return <CheckoutLoading />;
  }

  if (!plan) {
    return <CheckoutError onBack={() => router.back()} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <CheckoutHeader onBack={() => router.back()} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="space-y-6 lg:col-span-3">
            <CheckoutOrderSummary plan={plan} />
            <ClientSatisfactionBanner />
          </div>

          <div className="lg:col-span-2">
            <CheckoutPaymentPanel
              plan={plan}
              agree={agree}
              loading={loading}
              onAgreeChange={setAgree}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
