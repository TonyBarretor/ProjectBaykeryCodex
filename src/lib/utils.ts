import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isSaturday, isSunday, addDays, format } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: any) {
  const number = typeof value === "number" ? value : Number(value ?? 0);
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
  }).format(number);
}

export function getUpcomingWeekendDates(limit = 4) {
  const dates: Date[] = [];
  let pointer = new Date();

  while (dates.length < limit) {
    pointer = addDays(pointer, 1);
    if (isSaturday(pointer) || isSunday(pointer)) {
      dates.push(pointer);
    }
  }

  return dates;
}

export function formatDeliveryDate(date: Date) {
  return format(date, "EEEE d 'de' MMMM", { locale: es });
}

export function isWeekend(date: Date) {
  return isSaturday(date) || isSunday(date);
}
