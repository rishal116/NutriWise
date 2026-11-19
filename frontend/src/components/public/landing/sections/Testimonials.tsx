import { Quote, Star } from "lucide-react";

import type { PublicHomeTestimonialDTO } from "@/dtos/public/home/public-home-testimonial.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection";

function TestimonialCard({
  testimonial,
}: {
  testimonial: PublicHomeTestimonialDTO;
}) {
  return (
    <article className="relative rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Quote size={34} className="absolute right-6 top-6 text-emerald-100" />

      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={17}
            fill={index < testimonial.rating ? "currentColor" : "none"}
            className={index < testimonial.rating ? "" : "text-slate-200"}
          />
        ))}
      </div>

      <p className="mt-6 line-clamp-5 text-sm leading-7 text-slate-600">
        {testimonial.review}
      </p>

      <div className="mt-7 border-t border-slate-100 pt-5">
        <p className="font-bold text-slate-900">{testimonial.user.fullName}</p>

        <p className="mt-1 text-xs text-slate-500">
          Nutritionist: {testimonial.nutritionist.fullName}
        </p>
      </div>
    </article>
  );
}

export default function Testimonials() {
  return (
    <HomepageDataSection
      eyebrow="Real experiences"
      title="Stories from our community"
      description="Read about the experiences of people working toward healthier lives with NutriWise."
      fetchData={publicHomepageService.getLatestTestimonials}
      renderItem={(testimonial) => (
        <TestimonialCard testimonial={testimonial} />
      )}
    />
  );
}
