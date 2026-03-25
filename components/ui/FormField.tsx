import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, error, hint, children, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold tracking-[0.18em] text-muted flex items-center gap-1">
        {label}
        {required && <span className="text-alert">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-muted tracking-wide">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-alert font-bold tracking-wide">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full border px-3 py-2.5 text-[13px] bg-cream focus:outline-none focus:ring-1 transition-colors
        ${error ? "border-alert focus:ring-alert" : "border-border focus:border-ink focus:ring-ink"}
        ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full border px-3 py-2.5 text-[13px] bg-cream focus:outline-none focus:ring-1 transition-colors appearance-none
        ${error ? "border-alert focus:ring-alert" : "border-border focus:border-ink focus:ring-ink"}
        ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full border px-3 py-2.5 text-[13px] bg-cream focus:outline-none focus:ring-1 transition-colors resize-none
        ${error ? "border-alert focus:ring-alert" : "border-border focus:border-ink focus:ring-ink"}
        ${className}`}
      {...props}
    />
  );
}
