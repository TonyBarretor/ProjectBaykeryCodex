import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 3600;

export default async function DeliveryPage() {
  const zones = await prisma.deliveryZone.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="font-display text-4xl text-cacao-600">Zonas de reparto</h1>
        <p className="text-sm text-cacao-500">
          Repartimos sábados y domingos en los distritos listados. Selecciona tu turno al momento de reservar.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {zones.map((zone) => (
            <li key={zone.id} className="rounded-3xl bg-white p-6 text-left shadow-soft">
              <h2 className="font-semibold text-cacao-600">{zone.name}</h2>
              <p className="text-sm text-cacao-500">Delivery: {formatCurrency(zone.feePEN)}</p>
            </li>
          ))}
        </ul>
      </div>
      <section className="mx-auto mt-12 max-w-3xl space-y-3 rounded-3xl bg-white p-6 text-sm text-cacao-500 shadow-soft">
        <h2 className="text-lg font-semibold text-cacao-600">Política de entregas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Reserva hasta el jueves 10:00 p.m. para entregas del fin de semana.</li>
          <li>Selecciona mañana (9:00-12:00) o tarde (13:00-16:00).</li>
          <li>Recibirás un correo con un archivo calendario para recordar tu entrega.</li>
          <li>Pedidos pagados pueden reprogramarse hasta 48 horas antes.</li>
        </ul>
      </section>
    </main>
  );
}
