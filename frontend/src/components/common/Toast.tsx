// components/common/Toast.tsx
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number; // in ms
}

export default function Toast({ message, type = "success", duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-xl shadow-lg text-white font-medium transition-all ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`}>
      {message}
    </div>
  );
}
