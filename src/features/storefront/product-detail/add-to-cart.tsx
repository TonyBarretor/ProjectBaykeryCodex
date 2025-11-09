"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { formatCurrency, getUpcomingWeekendDates } from "@/lib/utils";
import { WeekendDatePicker } from "@/ui/weekend-date-picker";
import DeliveryWindowSelector from "@/ui/delivery-window-selector";
import { Button } from "@/ui/button";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  pricePEN: any;
  stock: number;
}

export default function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(getUpcomingWeekendDates(1)[0] ?? addDays(new Date(), 1));
  const [deliveryWindow, setDeliveryWindow] = useState("morning");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, quantity }],
          deliveryDate,
          deliveryWindow
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "No pudimos preparar tu pedido");
      }
      return res.json();
    },
    onSuccess: ({ checkoutId }) => {
      toast.success("Producto agregado. Continúa con el pago cuando estés listo.");
      router.push(`/checkout?checkoutId=${checkoutId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return (
    <div className="mt-6 space-y-4">
      <WeekendDatePicker value={deliveryDate} onChange={setDeliveryDate} />
      <DeliveryWindowSelector value={deliveryWindow} onChange={setDeliveryWindow} />
      <div className="flex items-center justify-between rounded-full bg-ivory-100 p-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-cacao-600 shadow"
          >
            –
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((qty) => Math.min(product.stock, qty + 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-cacao-600 shadow"
          >
            +
          </button>
        </div>
        <span className="text-sm font-semibold text-cacao-500">{formatCurrency(Number(product.pricePEN) * quantity)}</span>
      </div>
      <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending || product.stock <= 0}>
        {product.stock <= 0 ? "Agotado" : mutation.isPending ? "Preparando" : "Reservar para este fin de semana"}
      </Button>
    </div>
  );
}
