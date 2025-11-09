import { cn, formatDeliveryDate, getUpcomingWeekendDates } from "@/lib/utils";

export default function DeliveryNotice({ className }: { className?: string }) {
  const dates = getUpcomingWeekendDates(2);
  return (
    <div className={cn("mx-auto flex max-w-md flex-col gap-3 rounded-2xl bg-white/70 p-4 text-left text-sm text-cacao-500", className)}>
      <p className="font-semibold text-cacao-600">Delivery solo fines de semana</p>
      <ul className="space-y-1">
        {dates.map((date) => (
          <li key={date.toISOString()} className="flex items-center justify-between">
            <span>{formatDeliveryDate(date)}</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-burgundy-500">Cupos disponibles</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
