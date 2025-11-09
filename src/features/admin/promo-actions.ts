"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .transform((value) => value.trim().toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().positive(),
  minSubtotalPEN: z.coerce.number().nonnegative().default(0),
  maxUses: z.coerce.number().int().nonnegative().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  active: z.union([z.literal("on"), z.literal("off"), z.boolean()]).optional()
});

export async function createPromoAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const { code, type, value, minSubtotalPEN, maxUses, startsAt, endsAt, active } = parsed.data;

  await prisma.coupon.upsert({
    where: { code },
    create: {
      code,
      type,
      value,
      minSubtotalPEN,
      maxUses: maxUses ?? null,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      active: active === "on" || active === true
    },
    update: {
      value,
      minSubtotalPEN,
      maxUses: maxUses ?? null,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      active: active === "on" || active === true
    }
  });

  revalidatePath("/admin/promos");
  return { success: true };
}
