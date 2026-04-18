"use client";

import { useId } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const fileDropZoneClass =
  "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-6 py-8 text-center transition hover:border-emerald/35 hover:bg-slate-950/50";

export type FileDropZoneProps = {
  title: string;
  hint: string;
  accept: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  fileName?: string | null;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  minHeightClass?: string;
  id?: string;
  "aria-label"?: string;
};

export function FileDropZone({
  title,
  hint,
  accept,
  name,
  required,
  disabled,
  fileName,
  onChange,
  className,
  minHeightClass = "min-h-[140px]",
  id,
  "aria-label": ariaLabel,
}: FileDropZoneProps) {
  const genId = useId();
  const inputId = id ?? `${genId}-file`;

  return (
    <label
      className={twMerge(clsx(fileDropZoneClass, minHeightClass, className))}
      aria-label={ariaLabel ?? title}
    >
      <input
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        required={required}
        disabled={disabled}
        className="sr-only"
        onChange={onChange}
      />
      <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-light">{title}</span>
      <span className="text-xs text-slate-400">{hint}</span>
      {fileName !== undefined && fileName !== null ? (
        <span className="text-xs text-slate-500">{fileName || "Choose a file"}</span>
      ) : null}
    </label>
  );
}
