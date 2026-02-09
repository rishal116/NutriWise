"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface TooltipProps {
  text: string;
  targetRef: React.RefObject<HTMLElement>;
  visible: boolean;
}

export default function SidebarTooltip({
  text,
  targetRef,
  visible,
}: TooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!targetRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();

    setPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  }, [targetRef, visible]);

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translateY(-50%)",
      }}
      className="
        bg-[#202c33]
        text-white
        px-4 py-2
        rounded-lg
        shadow-2xl
        text-sm
        whitespace-nowrap
        z-[9999]
      "
    >
      {text}
    </div>,
    document.body
  );
}
