"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productInputSchema } from "@/lib/validators";
import { z } from "zod";
import { Button } from "@/ui/button";
import { useState } from "react";

const formSchema = productInputSchema.extend({
  id: z.string().cuid().optional()
});

type FormValues = z.infer<typeof formSchema>;

type EditableProduct = Omit<FormValues, "images" | "allergens" | "tags" | "pricePEN" | "costPEN" | "stock"> & {
  id: string;
  images: string[];
  allergens: string[];
  tags: string[];
  pricePEN: number;
  costPEN: number;
  stock: number;
};

export function ProductFormModal({
  triggerLabel,
  product,
  categories,
  onSubmit
}: {
  triggerLabel: string;
  product?: EditableProduct;
  categories: { id: string; name: string }[];
  onSubmit: (values: FormValues) => Promise<any>;
}) {
  const [open, setOpen] = useState(false);
  const defaultValues: FormValues = product
    ? {
        ...product,
        images: product.images,
        allergens: product.allergens,
        tags: product.tags
      }
    : {
        name: "",
        slug: "",
        description: "",
        pricePEN: 0,
        costPEN: 0,
        status: "draft",
        weekendOnly: false,
        allergens: [],
        images: [],
        stock: 0,
        tags: [],
        leadTimeDays: 2
      };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-xs">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase text-cacao-400">Nombre</label>
            <input
              className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
              defaultValue={product?.name ?? ""}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-burgundy-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-cacao-400">Slug</label>
            <input
              className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
              defaultValue={product?.slug ?? ""}
              {...register("slug")}
            />
            {errors.slug && <p className="text-xs text-burgundy-600">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-cacao-400">Descripción</label>
            <textarea
              className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
              rows={4}
              defaultValue={product?.description ?? ""}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-burgundy-600">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-cacao-400">Precio (PEN)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
                defaultValue={product?.pricePEN ?? 0}
                {...register("pricePEN", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-cacao-400">Costo (PEN)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
                defaultValue={product?.costPEN ?? 0}
                {...register("costPEN", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-cacao-400">Stock</label>
              <input
                type="number"
                className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
                defaultValue={product?.stock ?? 0}
                {...register("stock", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-cacao-400">Categoría</label>
              <select
                className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
                defaultValue={product?.categoryId ?? ""}
                {...register("categoryId")}
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-cacao-400">Estado</label>
              <select
                className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
                defaultValue={product?.status ?? "draft"}
                {...register("status")}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" className="h-4 w-4" defaultChecked={product?.weekendOnly ?? false} {...register("weekendOnly")} />
              <span className="text-xs font-semibold uppercase text-cacao-400">Solo fin de semana</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-cacao-400">Imágenes (URLs separadas por coma)</label>
            <input
              className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
              defaultValue={product?.images?.join(", ") ?? ""}
              {...register("images", {
                setValueAs: (value) =>
                  typeof value === "string"
                    ? value
                        .split(",")
                        .map((item: string) => item.trim())
                        .filter(Boolean)
                    : value
              })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-cacao-400">Alérgenos (separados por coma)</label>
            <input
              className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
              defaultValue={product?.allergens?.join(", ") ?? ""}
              {...register("allergens", {
                setValueAs: (value) =>
                  typeof value === "string"
                    ? value
                        .split(",")
                        .map((item: string) => item.trim())
                        .filter(Boolean)
                    : value
              })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-cacao-400">Etiquetas</label>
            <input
              className="mt-1 w-full rounded-2xl border border-ivory-200 px-4 py-2"
              defaultValue={product?.tags?.join(", ") ?? ""}
              {...register("tags", {
                setValueAs: (value) =>
                  typeof value === "string"
                    ? value
                        .split(",")
                        .map((item: string) => item.trim())
                        .filter(Boolean)
                    : value
              })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Guardando" : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
