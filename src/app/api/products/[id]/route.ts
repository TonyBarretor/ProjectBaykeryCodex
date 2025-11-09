import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validators";

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const payload = await request.json();
  const parsed = productInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 422 });
  }

  await prisma.product.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: Params) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
