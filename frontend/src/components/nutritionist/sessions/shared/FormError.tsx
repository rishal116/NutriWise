interface FormErrorProps {
  message?: string;
  id?: string;
  className?: string;
}

export function FormError({ message, id, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={`mt-1.5 text-xs font-medium text-rose-600 ${className}`}
    >
      {message}
    </p>
  );
}
