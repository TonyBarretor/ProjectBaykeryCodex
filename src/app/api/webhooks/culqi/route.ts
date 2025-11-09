import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CulqiEvent {
  type: string;
  data: {
    id: string;
    attributes: {
      metadata: {
        orderId?: string;
      };
      outcome: {
        type: string;
        user_message?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  const event = (await request.json()) as CulqiEvent;

  const orderId = event.data.attributes.metadata.orderId;
  if (!orderId) {
    return NextResponse.json({ message: "Sin orderId" }, { status: 202 });
  }

  const paymentStatus = event.data.attributes.outcome.type;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: paymentStatus === "venta_exitosa" ? "PAID" : "FAILED",
      status: paymentStatus === "venta_exitosa" ? "CONFIRMED" : "CANCELLED",
      providerRef: event.data.id
    }
  });

  return NextResponse.json({ received: true });
}
