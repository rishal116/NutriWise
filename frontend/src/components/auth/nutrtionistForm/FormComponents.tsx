"use client";
import React, { ChangeEvent, ReactNode } from "react";
import { X, Plus, Upload, LucideIcon } from "lucide-react";

// ------------------------------
// Types
// ------------------------------
type SectionProps = {
  title: string;
  children: ReactNode;
  error?: string;
  icon?: LucideIcon;
};

type DynamicInputProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
};

type InputFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

type SelectFieldProps = {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  multiple?: boolean;
  className?: string;
};


type FileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  fileName?: string;
  square?: boolean;
};
type AddButtonProps = {
  label: string;
  onClick: () => void;
};

type PrimaryButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// ------------------------------
// Components
// ------------------------------
export const Section: React.FC<SectionProps> = ({ title, children, error, icon: Icon }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-emerald-600" size={24} />}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="space-y-4 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      {children}
    </div>
    {error && (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200">
        <span>⚠</span>
        <span>{error}</span>
      </div>
    )}
  </div>
);

export const DynamicInput: React.FC<DynamicInputProps> = ({ value, placeholder, onChange, onRemove, canRemove }) => (
  <div className="flex gap-3 items-start">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
    />
    {canRemove && (
      <button 
        type="button" 
        onClick={onRemove} 
        className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      >
        <X size={18} />
      </button>
    )}
  </div>
);

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  type = "text",
  onChange,
  className = "",
  ...props
}) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className="font-medium text-gray-700 text-sm">
        {label}
      </label>
    )}
    <input
      {...props}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${className}`}
    />
  </div>
);


export const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, multiple = false, className = "" }) => (
  <div className="space-y-2 w-full">
    {label && <label className="font-medium text-gray-700 text-sm">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      multiple={multiple}
      className={`w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white ${className}`}
    >
      {!multiple && <option value="">-- Select --</option>}
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export const FileInput: React.FC<FileInputProps> = ({ label, fileName, square, ...props }) => (
  <div className="space-y-2">
    <label className="font-medium text-gray-700 text-sm">{label}</label>
    <div className="relative">
      <input
        type="file"
        {...props}
        className="hidden"
        id={label.replace(/\s+/g, "-").toLowerCase()}
      />
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-emerald-400 cursor-pointer transition-all
          ${square ? "h-64 p-6" : "py-6 px-4"}
          ${props.className || ""}
        `}
      >
        <Upload size={28} className="text-gray-500" />
        <span className="text-gray-600 text-sm font-medium text-center max-w-[80%]">
          {fileName || (props.multiple ? "Click / Drop multiple files" : "Click / Drop file to upload")}
        </span>

        {fileName && !props.multiple && (
          <p className="mt-1 text-xs font-medium text-emerald-600 truncate max-w-[80%]">
            {fileName}
          </p>
        )}
      </label>
    </div>
  </div>
);

export const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => (
  <button 
    type="button" 
    onClick={onClick} 
    className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
  >
    <Plus size={18} />
    {label}
  </button>
);

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className = "", disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 px-6 py-4 text-lg ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl transform hover:-translate-y-0.5"
    } ${className}`}
  >
    {children}
  </button>
);