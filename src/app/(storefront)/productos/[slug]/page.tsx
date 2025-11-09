import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/storefront/queries";
import AddToCartSection from "@/features/storefront/product-detail/add-to-cart";
import { formatCurrency } from "@/lib/utils";

interface Params {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Params) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images
    }
  };
}

export default async function ProductPage({ params }: Params) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();
  return (
    <main className="px-4 pb-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-soft md:w-1/2">
          <Image
            src={product.images?.[0] ?? "https://images.unsplash.com/photo-1542838132-92c53300491e"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-cacao-400">{product.category?.name ?? "Especial"}</p>
            <h1 className="font-display text-4xl text-cacao-600">{product.name}</h1>
            <p className="text-lg text-cacao-500">{product.description}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-wide text-cacao-400">Precio</p>
            <p className="text-3xl font-semibold text-burgundy-600">{formatCurrency(product.pricePEN)}</p>
            <p className="mt-4 text-sm text-cacao-500">
              <span className="font-semibold text-cacao-600">Ingredientes:</span> {product.allergens.join(", ") || "Ver descripción"}
            </p>
            <p className="text-sm text-cacao-500">
              <span className="font-semibold text-cacao-600">Alérgenos:</span> {product.allergens.join(", ") || "Consultar"}
            </p>
            <AddToCartSection product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
