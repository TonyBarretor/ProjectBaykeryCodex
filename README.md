# Baykery – E-commerce artesanal para Perú

Baykery es una tienda online móvil-first construida con Next.js 14 (App Router) para una panadería artesanal en Lima. Permite a los clientes reservar productos horneados para entrega exclusiva en fines de semana y a los administradores gestionar catálogo, pedidos, promociones y contenidos.

## Tabla de contenidos
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Configuración local](#configuración-local)
- [Migraciones y datos de ejemplo](#migraciones-y-datos-de-ejemplo)
- [Scripts disponibles](#scripts-disponibles)
- [Credenciales y variables de entorno](#credenciales-y-variables-de-entorno)
- [Flujos clave](#flujos-clave)
- [Pruebas](#pruebas)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Infraestructura recomendada](#infraestructura-recomendada)
- [Seguridad y cumplimiento](#seguridad-y-cumplimiento)
- [Roadmap sugerido](#roadmap-sugerido)

## Tecnologías
- **Next.js 14** con App Router, SSR/ISR.
- **TypeScript** y **ESLint**.
- **Tailwind CSS** + diseño inspirado en shadcn/ui.
- **Prisma ORM** sobre **PostgreSQL**.
- **NextAuth** (enlace mágico por correo + Google).
- **TanStack Query** para estados asíncronos.
- **Culqi** y **Mercado Pago** (integración preparada).
- **Resend** para correo transaccional con adjunto ICS.
- **UploadThing/Cloudinary** (hooks preparados vía env).
- **Jest** y **Playwright** (estructura preparada).

## Arquitectura
```
src/
  app/                 # Rutas públicas y privadas (storefront, admin, APIs)
  components/          # Providers globales
  features/            # Lógica reutilizable por dominio (storefront, admin, auth)
  lib/                 # Prisma, autenticación, utilidades, validaciones, mailer
  ui/                  # Componentes UI atómicos (botones, diálogos, pickers)
  styles/              # Tailwind globals
  tests/               # Pruebas unitarias (Jest)
prisma/
  schema.prisma        # Modelado de datos completo
```

## Requisitos previos
1. Node.js 18.17+ y pnpm/npm/yarn (usa `pnpm` recomendado).
2. PostgreSQL 14+ (puedes usar Neon, Supabase, Railway o local).
3. Cuenta en Culqi y Mercado Pago (modo sandbox para pruebas).
4. Cuenta en Resend (o configurar SMTP via Nodemailer).
5. Cuenta de almacenamiento (UploadThing o Cloudinary) para imágenes.

## Configuración local
1. Clona el repo y entra en el directorio.
2. Copia `.env.example` a `.env` y completa las variables.
   ```bash
   cp .env.example .env
   ```
3. Instala dependencias.
   ```bash
   pnpm install
   ```
4. Genera el cliente de Prisma y ejecuta migraciones.
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```
5. (Opcional) Ejecuta el seed con datos de muestra.
   ```bash
   pnpm seed
   ```
6. Arranca el entorno de desarrollo.
   ```bash
   pnpm dev
   ```
7. Abre `http://localhost:3000` en tu navegador.

## Migraciones y datos de ejemplo
- Prisma gestiona migraciones en la carpeta `prisma/migrations`.
- Ajusta `prisma/seed.ts` (plantilla incluida) para cargar productos, categorías y zonas de reparto.
- Usa `pnpm prisma:deploy` en producción (migraciones seguras).

## Scripts disponibles
| Script                | Descripción                                                |
|-----------------------|------------------------------------------------------------|
| `pnpm dev`            | Levanta Next.js en modo desarrollo.                        |
| `pnpm build`          | Compila para producción.                                   |
| `pnpm start`          | Arranca el build en modo producción.                       |
| `pnpm lint`           | Revisa reglas ESLint.                                      |
| `pnpm test`           | Ejecuta pruebas unitarias (Jest).                          |
| `pnpm prisma:*`       | Atajos para Prisma (generate, migrate, deploy).            |
| `pnpm seed`           | Corre el script de seed (`prisma/seed.ts`).                |

## Credenciales y variables de entorno
Completa las variables en `.env`:
- `DATABASE_URL`, `DIRECT_URL`: cadena de conexión a PostgreSQL.
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`: configuración NextAuth.
- `RESEND_API_KEY` o credenciales SMTP.
- `UPLOADTHING_*` o claves de Cloudinary.
- `CULQI_*`, `MERCADO_PAGO_*`: llaves privadas y públicas.
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`: observabilidad.
- `EMAIL_FROM`: remitente verificado.

## Flujos clave
- **Storefront:** catálogo optimizado móvil, cards con CTA, selector de fin de semana, horario y distrito, carrito/checkout validado server-side.
- **Checkout:** endpoint `/api/checkout` valida stock, fecha (solo sábado/domingo futuros), cupos por ventana (`BakeSlot`), crea borrador de orden.
- **Pagos:** endpoints stubbed `/api/payments/culqi` y `/api/payments/mercadopago` listos para conectar SDKs. Webhook `/api/webhooks/culqi` actualiza estado de pago.
- **Admin:** /admin protegido con NextAuth + RBAC; CRUD de productos, órdenes, métricas. Formularios con Zod + React Hook Form.
- **Emails:** `sendOrderConfirmationEmail` genera recibo con archivo ICS.

## Pruebas
- Unit tests: `pnpm test` (ejemplo en `src/tests/utils.test.ts`).
- E2E: estructura lista para Playwright (`@playwright/test`) — agrega specs en `e2e/` y ejecuta `pnpm exec playwright test`.

## Despliegue en Vercel
1. Conecta el repo a Vercel.
2. Configura variables de entorno en Vercel (Production y Preview).
3. Usa PostgreSQL gestionado (Neon/Supabase). Ajusta `DATABASE_URL` y ejecuta `pnpm prisma:deploy` via hook de build.
4. Activa ISR/SSR en Vercel automáticamente con Next.js 14.
5. Configura dominios personalizados (`baykery.pe`) y certificados SSL.

## Infraestructura recomendada
- **DB:** Neon o Supabase (tier pago para altas concurrencias).
- **Observabilidad:** Sentry (frontend/backend), Vercel Analytics.
- **Logs:** Logflare/BetterStack.
- **Backups:** snapshots automáticos de la DB cada 24h.
- **CDN imágenes:** UploadThing → Cloudflare R2 o Cloudinary.

## Seguridad y cumplimiento
- Validaciones estrictas con Zod tanto en formularios como API routes.
- Cookies seguras HTTPOnly; NextAuth + CSRF.
- Webhooks con verificación de firma (agregar lógica Culqi/MercadoPago en producción).
- Encriptar llaves via `VERCEL_ENV` / secretos; rota periódicamente.
- Cumplimiento GDPR/LPDP: endpoint `DELETE /api/orders/:id/cancel` permite cancelar + preparar reembolso.

## Roadmap sugerido
1. **Sprint 1:** catálogo público, checkout con validaciones, panel admin CRUD, capacidad weekend.
2. **Sprint 2:** integración Culqi/Mercado Pago real, correos transaccionales, analytics, contenidos CMS.
3. **Sprint 3:** GA4, Sentry, mejoras SEO (schema.org, sitemap), AB testing.
4. **Sprint 4:** Automatización logística (tracking, etiquetas), exportación contable.

¡Listo para hornear y entregar cada fin de semana! 🍞
