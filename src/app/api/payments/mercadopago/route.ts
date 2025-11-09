import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ message: "Pedido requerido" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ message: "Pedido no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    initPoint: `https://www.mercadopago.com.pe/checkout/v1/redirect?order=${orderId}`
  });
}
