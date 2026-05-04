import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  msg?: string;
}

export function FieldError({ msg }: FieldErrorProps) {
  if (!msg) return null;

  return (
    <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
      <AlertCircle size={11} />
      {msg}
    </p>
  );
}