import ProductGrid from "@/features/storefront/product-grid";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    include: {
      products: { where: { status: "published" }, orderBy: { createdAt: "desc" } }
    },
    orderBy: { name: "asc" }
  });

  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-4xl space-y-4 text-center">
        <h1 className="font-display text-4xl text-cacao-600">Menú completo</h1>
        <p className="text-sm text-cacao-500">
          Descubre todo lo que horneamos cada semana. Reserva antes del jueves para asegurar tu entrega.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-6xl space-y-12">
        {categories.map((category) => (
          <section key={category.id} className="space-y-6">
            <header>
              <h2 className="font-display text-3xl text-cacao-600">{category.name}</h2>
            </header>
            <ProductGrid
              products={category.products.map((product) => ({
                ...product,
                images: Array.isArray(product.images) ? (product.images as string[]) : [],
                allergens: Array.isArray(product.allergens) ? (product.allergens as string[]) : [],
                tags: Array.isArray(product.tags) ? (product.tags as string[]) : []
              }))}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
