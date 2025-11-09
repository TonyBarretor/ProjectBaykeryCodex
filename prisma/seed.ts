import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Panadería", slug: "panaderia" },
      { name: "Pastelería", slug: "pasteleria" }
    ],
    skipDuplicates: true
  });

  await prisma.deliveryZone.createMany({
    data: [
      { name: "Miraflores", feePEN: 12 },
      { name: "Barranco", feePEN: 10 },
      { name: "San Isidro", feePEN: 15 }
    ],
    skipDuplicates: true
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Pan de masa madre",
        slug: "pan-masa-madre",
        description: "Fermentación lenta con harina integral y centeno.",
        pricePEN: 18,
        costPEN: 7,
        status: "published",
        weekendOnly: true,
        images: ["https://images.unsplash.com/photo-1542838132-92c53300491e"],
        stock: 40,
        allergens: ["Gluten"],
        tags: ["masa madre"]
      },
      {
        name: "Brioches de cacao",
        slug: "brioches-cacao",
        description: "Relleno de chocolate peruano al 70% y mantequilla andina.",
        pricePEN: 22,
        costPEN: 9,
        status: "published",
        weekendOnly: false,
        images: ["https://images.unsplash.com/photo-1514996937319-344454492b37"],
        stock: 30,
        allergens: ["Gluten", "Lácteos"],
        tags: ["dulce"]
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
