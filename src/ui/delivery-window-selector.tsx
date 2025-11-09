"use client";

import { cn } from "@/lib/utils";

const WINDOWS = [
  { value: "morning", label: "Mañana (9:00 - 12:00)" },
  { value: "afternoon", label: "Tarde (13:00 - 16:00)" }
];

export default function DeliveryWindowSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-cacao-400">Horario</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {WINDOWS.map((window) => (
          <button
            key={window.value}
            type="button"
            onClick={() => onChange(window.value)}
            className={cn(
              "rounded-2xl border border-transparent bg-ivory-100 px-4 py-3 text-left text-sm font-semibold text-cacao-600 transition",
              value === window.value && "border-burgundy-500 bg-burgundy-50 text-burgundy-600"
            )}
          >
            {window.label}
          </button>
        ))}
      </div>
    </div>
  );
}
