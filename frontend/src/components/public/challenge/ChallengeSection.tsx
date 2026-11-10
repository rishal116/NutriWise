"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PublicChallengeSectionDTO } from "@/dtos/public/challenge/public-challenge-section.dto";

import { ChallengeCard } from "./ChallengeCard";

interface ChallengeSectionProps {
  section: PublicChallengeSectionDTO;
}

const ARROW_BUTTON_CLASSES = [
  "absolute top-1/2 z-20 hidden",
  "h-10 w-10 -translate-y-1/2",
  "items-center justify-center rounded-full",
  "border border-[#D1FAE5] bg-white/95 text-[#065F46]",
  "shadow-md shadow-black/5 backdrop-blur-sm",
  "transition-all duration-200",
  "hover:-translate-y-1/2 hover:scale-105",
  "hover:bg-[#ECFDF5] hover:shadow-lg",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]",
  "disabled:pointer-events-none disabled:scale-95 disabled:opacity-0",
  "lg:flex",
].join(" ");

export function ChallengeSection({ section }: ChallengeSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    updateScrollState();

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, section.items.length]);

  const scrollRow = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.82;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollRow("left");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollRow("right");
    }
  };

  if (section.items.length === 0) return null;

  return (
    <section
      aria-labelledby={`challenge-section-${section.key}`}
      className="relative"
    >
      {/* Section heading */}
      <div className="mb-5 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className="h-6 w-1 shrink-0 rounded-full bg-[#047857]"
              aria-hidden="true"
            />
            <h2
              id={`challenge-section-${section.key}`}
              className="truncate text-xl font-bold tracking-tight text-[#065F46] sm:text-2xl"
            >
              {section.title}
            </h2>
          </div>

          <p className="mt-1.5 pl-3.5 text-sm text-slate-600">
            Explore challenges and build healthier habits.
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1 text-xs font-medium text-slate-600 lg:flex">
          <span>
            {section.items.length}{" "}
            {section.items.length === 1 ? "challenge" : "challenges"}
          </span>
        </div>
      </div>

      {/* Rail */}
      <div className="relative">
        {/* Left fade */}
        <div
          className={[
            "pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14",
            "bg-gradient-to-r from-[#F8FAF9] via-[#F8FAF9]/80 to-transparent",
            "transition-opacity duration-200 md:block",
            canScrollLeft ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden="true"
        />

        {/* Right fade */}
        <div
          className={[
            "pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20",
            "bg-gradient-to-l from-[#F8FAF9] via-[#F8FAF9]/80 to-transparent",
            "transition-opacity duration-200 md:block",
            canScrollRight ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden="true"
        />

        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label={`${section.title} challenges`}
          aria-roledescription="carousel"
          tabIndex={0}
          className={[
            "scrollbar-none flex gap-4 overflow-x-auto",
            "overscroll-x-contain snap-x snap-mandatory",
            "px-4 pb-3 sm:gap-5 sm:px-6 lg:px-8",
            "focus:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#047857]/40",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAF9]",
          ].join(" ")}
        >
          {section.items.map((challenge) => (
            <div
              key={challenge.id}
              className="w-[72vw] shrink-0 snap-start xs:w-[58vw] sm:w-[290px] md:w-[300px] lg:w-[310px] xl:w-[320px]"
            >
              <ChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>

        {/* Previous */}
        <button
          type="button"
          onClick={() => scrollRow("left")}
          disabled={!canScrollLeft}
          aria-hidden={!canScrollLeft}
          tabIndex={canScrollLeft ? 0 : -1}
          aria-label={`Scroll ${section.title} left`}
          className={`${ARROW_BUTTON_CLASSES} left-2`}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={() => scrollRow("right")}
          disabled={!canScrollRight}
          aria-hidden={!canScrollRight}
          tabIndex={canScrollRight ? 0 : -1}
          aria-label={`Scroll ${section.title} right`}
          className={`${ARROW_BUTTON_CLASSES} right-2`}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
