import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const weekendOnly = searchParams.get("weekendOnly") === "true";

  const products = await prisma.product.findMany({
    where: {
      status: "published",
      category: category ? { slug: category } : undefined,
      weekendOnly: weekendOnly ? true : undefined
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = productInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 422 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
