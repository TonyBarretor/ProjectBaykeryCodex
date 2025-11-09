"use client";

import { addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo } from "react";
import { cn, getUpcomingWeekendDates } from "@/lib/utils";

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
}

export function WeekendDatePicker({ value, onChange }: Props) {
  const options = useMemo(() => {
    const start = addDays(new Date(), -1);
    return getUpcomingWeekendDates(6).filter((date) => date > start);
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-cacao-400">Entrega</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((date) => {
          const isActive = value ? isSameDay(value, date) : false;
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onChange(date)}
              className={cn(
                "rounded-2xl border border-transparent bg-ivory-100 px-4 py-3 text-left text-sm font-semibold text-cacao-600 transition",
                isActive && "border-burgundy-500 bg-burgundy-50 text-burgundy-600"
              )}
            >
              <span className="block text-xs uppercase text-cacao-400">{format(date, "EEEE", { locale: es })}</span>
              <span className="text-base">{format(date, "d 'de' MMM", { locale: es })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
