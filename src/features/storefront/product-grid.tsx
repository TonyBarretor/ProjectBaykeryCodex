import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  name: string;
  pricePEN: any;
  images: string[];
  weekendOnly: boolean;
  category?: { name: string } | null;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft">
          <Link href={`/productos/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
            <Image
              src={product.images?.[0] ?? "https://images.unsplash.com/photo-1542838132-92c53300491e"}
              alt={product.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </Link>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-cacao-400">
                {product.category?.name ?? "Especial"}
              </span>
              {product.weekendOnly && (
                <span className="rounded-full bg-burgundy-100 px-3 py-1 text-[11px] font-semibold text-burgundy-600">
                  Solo fin de semana
                </span>
              )}
            </div>
            <h3 className="font-display text-xl text-cacao-600">
              <Link href={`/productos/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="text-lg font-semibold text-burgundy-600">{formatCurrency(product.pricePEN)}</p>
            <Link
              href={`/productos/${product.slug}`}
              className="mt-auto inline-flex items-center justify-center rounded-full bg-cacao-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cacao-500"
            >
              Ver detalle
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
