"use client";

import { useTransition } from "react";
import { Button } from "@/ui/button";
import { formatDeliveryDate, formatCurrency } from "@/lib/utils";
import { updateOrderStatusAction } from "@/features/admin/order-actions";
import { toast } from "sonner";

interface Order {
  id: string;
  email: string;
  status: string;
  paymentStatus: string;
  totalPEN: any;
  deliveryDate: string;
  deliveryWindow: string;
  zone?: { name: string } | null;
  items: { id: string; nameSnapshot: string; qty: number }[];
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <table className="min-w-full divide-y divide-ivory-200 text-sm">
        <thead className="bg-ivory-100 text-left uppercase tracking-wide text-xs text-cacao-400">
          <tr>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Entrega</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ivory-100">
          {orders.map((order) => (
            <tr key={order.id} className="align-top hover:bg-ivory-50">
              <td className="px-4 py-4">
                <div className="font-semibold text-cacao-600">#{order.id.slice(-6)}</div>
                <ul className="mt-1 text-xs text-cacao-400">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.qty} × {item.nameSnapshot}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-cacao-600">{order.email}</p>
                <p className="text-xs text-cacao-400">Zona: {order.zone?.name ?? "Lima"}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-cacao-600">
                  {formatDeliveryDate(new Date(order.deliveryDate))} ({order.deliveryWindow})
                </p>
              </td>
              <td className="px-4 py-4">{formatCurrency(order.totalPEN)}</td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-ivory-100 px-3 py-1 text-xs font-semibold text-cacao-500">
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {order.status !== "COMPLETED" && (
                    <Button
                      variant="secondary"
                      disabled={isPending}
                      className="text-xs"
                      onClick={() =>
                        startTransition(async () => {
                          const result = await updateOrderStatusAction({ id: order.id, status: "COMPLETED" });
                          if (result.error) toast.error(result.error);
                          else toast.success("Pedido marcado como completado");
                        })
                      }
                    >
                      Completar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
