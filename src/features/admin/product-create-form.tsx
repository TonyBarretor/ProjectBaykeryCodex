import { prisma } from "@/lib/prisma";
import { upsertProductAction } from "@/features/admin/product-actions";
import { productInputSchema } from "@/lib/validators";
import { z } from "zod";
import { redirect } from "next/navigation";

const formSchema = productInputSchema.extend({
  id: z.string().cuid().optional()
});

type FormState = {
  errors?: string[];
  success?: boolean;
};

export async function createProductAction(prevState: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const data = Object.fromEntries(formData.entries());
  const parsed = formSchema.safeParse({
    name: data.name,
    slug: data.slug,
    description: data.description,
    pricePEN: Number(data.pricePEN),
    costPEN: Number(data.costPEN),
    status: data.status,
    weekendOnly: data.weekendOnly === "on",
    allergens: String(data.allergens || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    images: String(data.images || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    stock: Number(data.stock),
    sku: data.sku ? String(data.sku) : undefined,
    categoryId: data.categoryId ? String(data.categoryId) : undefined,
    tags: String(data.tags || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    leadTimeDays: Number(data.leadTimeDays || 2)
  });

  if (!parsed.success) {
    return { errors: parsed.error.errors.map((error) => error.message) };
  }

  await upsertProductAction(parsed.data);
  redirect("/admin/products");
}

export default async function ProductCreateForm() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <form action={createProductAction} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Nombre</span>
          <input name="name" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Slug</span>
          <input name="slug" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
      </div>
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-cacao-400">Descripción</span>
        <textarea name="description" rows={4} className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
      </label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Precio (PEN)</span>
          <input type="number" name="pricePEN" step="0.01" min="0" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Costo (PEN)</span>
          <input type="number" name="costPEN" step="0.01" min="0" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Stock</span>
          <input type="number" name="stock" min="0" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" required />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Categoría</span>
          <select name="categoryId" className="w-full rounded-2xl border border-ivory-200 px-4 py-2">
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase text-cacao-400">Estado</span>
          <select name="status" className="w-full rounded-2xl border border-ivory-200 px-4 py-2">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="weekendOnly" className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase text-cacao-400">Solo fin de semana</span>
        </label>
      </div>
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-cacao-400">Imágenes (URLs separadas por coma)</span>
        <input name="images" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-cacao-400">Alérgenos</span>
        <input name="allergens" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-cacao-400">Etiquetas</span>
        <input name="tags" className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-cacao-400">Lead time (días)</span>
        <input type="number" name="leadTimeDays" min="0" defaultValue={2} className="w-full rounded-2xl border border-ivory-200 px-4 py-2" />
      </label>
      <button type="submit" className="w-full rounded-full bg-burgundy-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-600">
        Guardar producto
      </button>
    </form>
  );
}
