import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

async function getRevenueThisMonth() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const total = await prisma.order.aggregate({
    where: { createdAt: { gte: start }, paymentStatus: "PAID" },
    _sum: { totalPEN: true }
  });
  return Number(total._sum.totalPEN ?? 0);
}

export default async function MetricsCards({
  orderCount,
  productCount
}: {
  orderCount: number;
  productCount: number;
}) {
  const revenue = await getRevenueThisMonth();

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-xs uppercase text-cacao-400">Pedidos</p>
        <p className="mt-2 text-3xl font-semibold text-cacao-600">{orderCount}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-xs uppercase text-cacao-400">Productos publicados</p>
        <p className="mt-2 text-3xl font-semibold text-cacao-600">{productCount}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-xs uppercase text-cacao-400">Ingresos este mes</p>
        <p className="mt-2 text-3xl font-semibold text-cacao-600">{formatCurrency(revenue)}</p>
      </div>
    </section>
  );
}
