/* ============================ SUB-COMPONENTS ============================ */

type Option = {
  id: string;
  label: string;
};

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function SectionCard({ icon: Icon, title, children }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
        {label}
      </p>
      <p className="text-sm font-medium line-clamp-1">{value}</p>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  error,
  prefix,
  placeholder,
}: any) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase">
        {label}
      </label>
      <div className="relative group">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-600">
            {prefix}
          </span>
        )}
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${prefix ? "pl-11" : "px-4"} py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all outline-none text-sm text-gray-700`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({ label, value, onChange, error, placeholder }: any) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all outline-none text-sm text-gray-700 resize-none"
      />
      {error && (
        <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
  error,
  disabled,
}: SelectProps) {
  const selectId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase"
      >
        {label}
      </label>

      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all outline-none text-sm text-gray-700 appearance-none cursor-pointer"
      >
        <option value="">{disabled ? "Loading..." : `Select ${label}`}</option>

        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
