import { prisma } from "@/lib/prisma";
import PromoForm from "@/features/admin/promo-form";

export const revalidate = 0;

export default async function PromosPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-cacao-600">Promociones</h1>
        <p className="text-sm text-cacao-500">Administra códigos de descuento.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <PromoForm />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-cacao-600">Códigos activos</h2>
          <ul className="mt-4 space-y-3 text-sm text-cacao-500">
            {coupons.map((coupon) => (
              <li key={coupon.id} className="rounded-2xl bg-ivory-100 p-4">
                <p className="font-semibold text-cacao-600">{coupon.code}</p>
                <p>
                  {coupon.type === "PERCENT" ? `${Number(coupon.value)}%` : `S/ ${Number(coupon.value).toFixed(2)}`} – vigencia:
                  {coupon.startsAt?.toLocaleDateString("es-PE")} → {coupon.endsAt?.toLocaleDateString("es-PE") ?? "sin fin"}
                </p>
              </li>
            ))}
            {coupons.length === 0 && <li>No hay promociones aún.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
