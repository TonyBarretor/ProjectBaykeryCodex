import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { orderId, token, installments } = await request.json();
  if (!orderId || !token) {
    return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ message: "Pedido no encontrado" }, { status: 404 });
  }

  // Normally call Culqi API here. For production, exchange token for charge.
  // We'll simulate success for this template.
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      providerRef: token,
      updatedAt: new Date()
    }
  });

  return NextResponse.json({ status: "paid", installments: installments ?? 0 });
}
