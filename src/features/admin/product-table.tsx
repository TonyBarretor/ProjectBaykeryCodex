"use client";

import { useTransition } from "react";
import { deleteProductAction, upsertProductAction } from "@/features/admin/product-actions";
import { ProductFormModal } from "@/features/admin/product-form";
import { toast } from "sonner";
import { Button } from "@/ui/button";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  pricePEN: any;
  stock: number;
  weekendOnly: boolean;
  category?: { id: string; name: string } | null;
  images: string[];
  allergens: string[];
  description: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function ProductTable({
  products,
  categories
}: {
  products: ProductRow[];
  categories: Category[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteProductAction({ id });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Producto eliminado");
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <table className="min-w-full divide-y divide-ivory-200 text-sm">
        <thead className="bg-ivory-100 text-left uppercase tracking-wide text-xs text-cacao-400">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ivory-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-ivory-50">
              <td className="px-4 py-4">
                <div className="font-semibold text-cacao-600">{product.name}</div>
                <p className="text-xs text-cacao-400">{product.category?.name ?? "Sin categoría"}</p>
              </td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-ivory-100 px-3 py-1 text-xs font-semibold text-cacao-500">
                  {product.status}
                </span>
              </td>
              <td className="px-4 py-4">S/ {Number(product.pricePEN).toFixed(2)}</td>
              <td className="px-4 py-4">{product.stock}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <ProductFormModal
                    triggerLabel="Editar"
                    product={product}
                    categories={categories}
                    onSubmit={async (values) => {
                      const result = await upsertProductAction({ ...values, id: product.id });
                      if (result.error) {
                        toast.error(result.error);
                      } else {
                        toast.success("Producto actualizado");
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleDelete(product.id)}
                    className="text-xs"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
