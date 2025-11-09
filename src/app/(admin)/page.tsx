import { prisma } from "@/lib/prisma";
import MetricsCards from "@/features/admin/metrics-cards";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { status: "published" } })
  ]);
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl text-cacao-600">Resumen</h1>
        <p className="text-sm text-cacao-500">Estado general de la tienda.</p>
      </header>
      <MetricsCards orderCount={orders} productCount={products} />
    </div>
  );
}
