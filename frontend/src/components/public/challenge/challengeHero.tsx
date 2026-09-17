// frontend/src/features/challenges/public/ChallengeHero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroSlide {
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    label: "Mental Wellness",
    title: "Nurture a calmer mind",
    description:
      "Build focus and emotional balance through simple daily practices.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
    alt: "Person practicing mindfulness in a calm, quiet space",
  },
  {
    label: "Physical Fitness",
    title: "Move your body, strengthen your life",
    description:
      "A consistent routine that builds strength, mobility, and energy.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
    alt: "Person exercising outdoors with strong, confident posture",
  },
  {
    label: "Healthy Lifestyle",
    title: "Small habits, meaningful change",
    description:
      "Balanced nutrition, hydration, and sleep, built one day at a time.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
    alt: "Fresh, balanced meal being prepared at home",
  },
];

const SLIDE_INTERVAL_MS = 10_000;

export function ChallengeHero() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % HERO_SLIDES.length);
      }, SLIDE_INTERVAL_MS);
    };
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [index]);

  return (
    <section
      aria-label="Featured wellness themes"
      className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-slate-100"
    >
      <div className="relative h-[360px] sm:h-[420px] lg:h-[480px]">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.label}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={i === index ? slide.alt : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent"
              aria-hidden="true"
            />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 px-5 pb-14 sm:px-8 sm:pb-16 lg:px-10 lg:pb-16">
          <div className="max-w-lg">
            <span className="inline-block rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white">
              {HERO_SLIDES[index].label}
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {HERO_SLIDES[index].title}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/85 sm:text-base">
              {HERO_SLIDES[index].description}
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Wellness theme slides"
          className="absolute bottom-5 left-5 flex items-center gap-2 sm:left-8 lg:left-10"
        >
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.label}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${slide.label} slide`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                i === index
                  ? "w-7 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
