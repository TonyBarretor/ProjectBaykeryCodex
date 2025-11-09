import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ message: "Pedido no existe" }, { status: 404 });

  if (order.paymentStatus === "PAID") {
    // trigger refund via Culqi/MercadoPago in production
  }

  await prisma.order.update({
    where: { id: params.id },
    data: { status: "CANCELLED", paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : order.paymentStatus }
  });

  return NextResponse.json({ success: true });
}
