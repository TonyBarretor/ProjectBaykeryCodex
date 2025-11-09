import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators";
import { isWeekend } from "@/lib/utils";
import { differenceInCalendarDays, isBefore, startOfDay } from "date-fns";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = checkoutSchema.safeParse(payload);
    if (!result.success) {
      return NextResponse.json(
        { message: "Revisa tu pedido", errors: result.error.flatten() },
        { status: 422 }
      );
    }

    const { items, deliveryDate, deliveryWindow, email, zoneId, notes } = result.data;

    const delivery = startOfDay(deliveryDate);
    if (!isWeekend(delivery) || isBefore(delivery, startOfDay(new Date()))) {
      return NextResponse.json({ message: "Elige sábado o domingo futuros" }, { status: 422 });
    }

    if (differenceInCalendarDays(delivery, new Date()) > 60) {
      return NextResponse.json({ message: "Solo aceptamos reservas con hasta 60 días" }, { status: 422 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) }, status: "published" }
    });

    if (products.length !== items.length) {
      return NextResponse.json({ message: "Producto no disponible" }, { status: 404 });
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ message: `Solo quedan ${product?.stock ?? 0} unidades` }, { status: 409 });
      }
    }

    const subtotal = products.reduce((total, product) => {
      const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0;
      return total + Number(product.pricePEN) * quantity;
    }, 0);

    const zone = zoneId ? await prisma.deliveryZone.findUnique({ where: { id: zoneId, active: true } }) : null;
    const deliveryFee = zone ? Number(zone.feePEN) : 0;
    const total = subtotal + deliveryFee;

    const bakeSlot = await prisma.bakeSlot.upsert({
      where: { deliveryDate_deliveryWindow: { deliveryDate: delivery, deliveryWindow } },
      create: { deliveryDate: delivery, deliveryWindow, capacity: 40, reserved: 0 },
      update: {}
    });

    if (bakeSlot.reserved >= bakeSlot.capacity) {
      return NextResponse.json({ message: "No tenemos más cupos en ese horario" }, { status: 409 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const updatedSlot = await tx.bakeSlot.update({
        where: { id: bakeSlot.id },
        data: { reserved: { increment: 1 } }
      });
      if (updatedSlot.reserved > updatedSlot.capacity) {
        throw new Error("CAPACITY_REACHED");
      }

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      const orderDraft = await tx.order.create({
        data: {
          email: email ?? "checkout@baykery.pe",
          subtotalPEN: subtotal,
          deliveryFeePEN: deliveryFee,
          totalPEN: total,
          paymentProvider: "CULQI",
          deliveryDate: delivery,
          deliveryWindow,
          zoneId: zone?.id,
          customerNotes: notes,
          items: {
            create: items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: product.id,
                qty: item.quantity,
                nameSnapshot: product.name,
                priceSnapshotPEN: product.pricePEN
              };
            })
          }
        }
      });

      return orderDraft;
    });

    return NextResponse.json({ checkoutId: order.id, total });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "CAPACITY_REACHED") {
      return NextResponse.json({ message: "Se agotaron los cupos" }, { status: 409 });
    }
    return NextResponse.json({ message: "Error al crear el pedido" }, { status: 500 });
  }
}
