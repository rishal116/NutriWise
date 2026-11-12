
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface ActivitySelectOption<T extends string> {
  value: T;
  label: string;
}

interface ActivitySelectProps<T extends string> {
  id: string;
  value: T | undefined;
  options: ActivitySelectOption<T>[];
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: T) => void;
}

export default function ActivitySelect<T extends string>({
  id,
  value,
  options,
  disabled = false,
  placeholder = "Select an option",
  onChange,
}: ActivitySelectProps<T>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative mt-1">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 outline-none transition-colors hover:border-emerald-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedOption ? "" : "text-slate-400"}>
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 top-full z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.label}

                {selected && (
                  <Check
                    size={15}
                    aria-hidden="true"
                    className="text-emerald-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
