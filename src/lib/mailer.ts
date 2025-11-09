import { Buffer } from "node:buffer";
import { Resend } from "resend";
import { createEvent } from "ics";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  deliveryDate,
  deliveryWindow,
  total
}: {
  to: string;
  orderId: string;
  deliveryDate: Date;
  deliveryWindow: string;
  total: number;
}) {
  const { error, value } = createEvent({
    title: "Entrega Baykery",
    start: [
      deliveryDate.getFullYear(),
      deliveryDate.getMonth() + 1,
      deliveryDate.getDate(),
      deliveryWindow === "morning" ? 9 : 13,
      0
    ],
    duration: { hours: 3 },
    description: `Pedido #${orderId}`
  });

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Baykery <hola@baykery.pe>",
    to,
    subject: `Tu pedido ${orderId} está confirmado`,
    html: `<p>Gracias por ordenar en Baykery. Entregaremos el ${deliveryDate.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })} en el turno ${deliveryWindow}. Total: S/ ${total.toFixed(2)}</p>`,
    attachments: error || !value
      ? []
      : [
          {
            filename: "baykery-entrega.ics",
            content: Buffer.from(value)
          }
        ]
  });
}
