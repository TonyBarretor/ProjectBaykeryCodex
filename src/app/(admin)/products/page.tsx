import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductTable from "@/features/admin/product-table";
import { Button } from "@/ui/button";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-cacao-600">Productos</h1>
          <p className="text-sm text-cacao-500">Gestiona tu catálogo semanal.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Nuevo producto</Link>
        </Button>
      </header>
      <ProductTable products={products} categories={categories} />
    </div>
  );
}
