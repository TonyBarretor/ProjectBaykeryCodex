import { ReactNode } from "react";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-ivory-50">
      <header className="sticky top-0 z-20 border-b border-ivory-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-display text-2xl text-cacao-600">
            Baykery Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-cacao-500">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/products">Productos</Link>
            <Link href="/admin/orders">Pedidos</Link>
            <Link href="/admin/promos">Promos</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
