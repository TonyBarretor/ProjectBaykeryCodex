import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } });

  const productEntries = products.map((product) => ({
    url: `https://baykery.pe/productos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [
    {
      url: "https://baykery.pe",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...productEntries
  ];
}
