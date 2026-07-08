import { FileCheck, ShieldCheck, ClipboardList, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: ClipboardList,
    title: "Fill Application",
    description:
      "Provide your qualifications, work experience, specializations, languages, resume and certifications.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Verification",
    description:
      "Our admin team reviews your documents and verifies your professional background.",
  },
  {
    icon: FileCheck,
    title: "Start Coaching",
    description:
      "Once approved, you'll receive the Nutritionist role and can start accepting clients.",
  },
];

export default function NutritionistApplicationPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-emerald-50 p-3">
              <FileCheck className="h-7 w-7 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Become a Nutritionist
              </h1>
              <p className="mt-2 text-slate-600">
                Apply to become a verified nutritionist on NutriWise and start
                helping people achieve healthier lives.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-xl border border-slate-200 bg-white p-6 transition hover:border-emerald-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    0{i + 1}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>

                {i < steps.length - 1 && (
                  <div className="absolute right-[-13px] top-1/2 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Ready to join NutriWise?
          </h2>
          <p className="mt-3 text-slate-600">
            Complete your professional profile and submit your application for
            review.
          </p>

          <Link
            href="/user/nutritionist/application/form"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}