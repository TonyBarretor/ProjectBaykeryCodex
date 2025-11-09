import { createPromoAction } from "@/features/admin/promo-actions";

export default function PromoForm() {
  return (
    <form action={createPromoAction} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Código</span>
          <input name="code" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Tipo</span>
          <select name="type" className="w-full rounded-2xl border border-ivory-200 px-4 py-2">
            <option value="PERCENT">Porcentaje</option>
            <option value="FIXED">Monto fijo</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Valor</span>
          <input name="value" type="number" step="0.01" min="0" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Mínimo carrito</span>
          <input name="minSubtotalPEN" type="number" step="0.01" min="0" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" defaultValue={0} />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Máximo usos</span>
          <input name="maxUses" type="number" min="0" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Inicio</span>
          <input type="date" name="startsAt" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Fin</span>
          <input type="date" name="endsAt" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
        </label>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase text-cacao-400">Activo</span>
      </label>
      <button type="submit" className="w-full rounded-full bg-burgundy-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-600">
        Crear código
      </button>
    </form>
  );
}
