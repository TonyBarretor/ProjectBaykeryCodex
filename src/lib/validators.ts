import { z } from "zod";
import { isWeekend } from "@/lib/utils";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().min(1)
      })
    )
    .min(1),
  deliveryDate: z.coerce.date().refine((date) => isWeekend(date), {
    message: "Solo puedes programar entregas sábado o domingo"
  }),
  deliveryWindow: z.enum(["morning", "afternoon"]),
  email: z.string().email().optional(),
  zoneId: z.string().optional(),
  notes: z.string().max(500).optional()
});

export const productInputSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  pricePEN: z.number().positive(),
  costPEN: z.number().nonnegative(),
  status: z.enum(["draft", "published"]),
  weekendOnly: z.boolean().default(false),
  allergens: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  stock: z.number().int().nonnegative(),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  leadTimeDays: z.number().int().min(0).default(2)
});
