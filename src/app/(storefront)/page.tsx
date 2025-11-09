import Link from "next/link";
import { getFeaturedProducts } from "@/features/storefront/queries";
import ProductGrid from "@/features/storefront/product-grid";
import DeliveryNotice from "@/features/storefront/delivery-notice";

export const revalidate = 60;

export default async function StorefrontPage() {
  const products = await getFeaturedProducts();
  return (
    <main className="px-4 pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ivory-100 via-white to-ivory-200 p-10 text-center shadow-soft">
        <div className="mx-auto max-w-xl space-y-4">
          <p className="uppercase tracking-[0.3em] text-xs text-cacao-500">Baykery</p>
          <h1 className="font-display text-4xl font-semibold text-cacao-600 sm:text-5xl">
            Panes artesanales con delivery este fin de semana
          </h1>
          <p className="text-base text-cacao-500">
            Hechos con masa madre, harinas peruanas y mucho cariño. Reserva tu lugar para este sábado o domingo.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#productos"
              className="rounded-full bg-burgundy-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-burgundy-600"
            >
              Ver productos
            </Link>
            <Link href="/delivery" className="text-sm font-semibold text-cacao-500">
              Zonas y horarios
            </Link>
          </div>
        </div>
        <DeliveryNotice className="mt-8" />
      </section>
      <section id="productos" className="mx-auto mt-14 max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl text-cacao-600">Nuestros destacados</h2>
            <p className="text-sm text-cacao-500">Actualizamos el menú cada semana según ingredientes de temporada.</p>
          </div>
          <Link href="/menu" className="text-sm font-semibold text-burgundy-500">
            Ver menú completo
          </Link>
        </header>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
