import ProductCreateForm from "@/features/admin/product-create-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cacao-600">Nuevo producto</h1>
        <p className="text-sm text-cacao-500">Completa los campos para publicar en el menú.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <ProductCreateForm />
      </div>
    </div>
  );
}
