interface UploadProgressBarProps {
  value: number;
}

export function UploadProgressBar({ value }: UploadProgressBarProps) {
  return (
    <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-teal-500 transition-all duration-200 rounded-full"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
