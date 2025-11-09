import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getFeaturedProducts = cache(async () => {
  const products = await prisma.product.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { category: true }
  });
  return products.map((product) => ({
    ...product,
    images: Array.isArray(product.images) ? product.images : []
  }));
});

export const getProductBySlug = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });
  if (!product) return null;
  return {
    ...product,
    images: Array.isArray(product.images) ? product.images : []
  };
});
