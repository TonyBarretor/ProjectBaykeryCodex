import { prisma } from "@/lib/prisma";
import OrdersTable from "@/features/admin/orders-table";

export const revalidate = 0;

export default async function OrdersPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      zone: true
    }
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-cacao-600">Pedidos</h1>
        <p className="text-sm text-cacao-500">Administra entregas y pagos.</p>
      </header>
      <OrdersTable orders={orders} />
    </div>
  );
}
