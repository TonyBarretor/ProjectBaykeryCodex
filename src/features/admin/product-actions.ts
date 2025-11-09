"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validators";
import { z } from "zod";

const schema = productInputSchema.extend({
  id: z.string().cuid().optional()
});

export async function upsertProductAction(input: unknown) {
  try {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return { error: "Datos inválidos" };
    }

    const { id, ...data } = parsed.data;
    if (id) {
      await prisma.product.update({
        where: { id },
        data
      });
    } else {
      await prisma.product.create({ data });
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No pudimos guardar" };
  }
}

export async function deleteProductAction({ id }: { id: string }) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "No pudimos eliminar" };
  }
}
