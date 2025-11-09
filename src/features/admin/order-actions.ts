"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string().cuid(),
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "COMPLETED", "CANCELLED"])
});

export async function updateOrderStatusAction(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos" };

  try {
    await prisma.order.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status }
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No pudimos actualizar" };
  }
}
