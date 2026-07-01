import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
const image =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85";
async function main() {
  await prisma.user.upsert({
    where: { email: "admin@beauty.local" },
    update: { role: Role.SUPER_ADMIN },
    create: { name: "Super Admin", email: "admin@beauty.local", role: Role.SUPER_ADMIN },
  });
  await prisma.user.upsert({
    where: { email: "content@beauty.local" },
    update: { role: Role.ADMIN },
    create: { name: "Content Admin", email: "content@beauty.local", role: Role.ADMIN },
  });
  const categories = new Map<string, string>();
  for (const name of ["Lips", "Face", "Eyes", "Everyday"]) {
    const slug = name.toLowerCase();
    const value = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        imageUrl: image,
        description: `${name} essentials for everyday beauty.`,
      },
    });
    categories.set(slug, value.id);
  }
  for (const [name, slug, category, price] of [
    ["Power Lash", "power-lash", "eyes", 139000],
    ["Lip Liner", "lip-liner", "lips", 99000],
    ["Lip Coat Butter Fudge", "lip-coat-butter-fudge", "lips", 129000],
    ["Airbrush Powder", "airbrush-powder", "face", 189000],
  ] as const) {
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        description: `${name}, a high-performance formula made for every day.`,
        price,
        imageUrl: image,
        categoryId: categories.get(category)!,
        badge: "BEST SELLER",
        stock: 40,
        isBestSeller: true,
        isPublished: true,
      },
    });
  }
  if (!(await prisma.banner.findFirst({ where: { title: "Beauty for Every Version of You" } })))
    await prisma.banner.create({
      data: {
        title: "Beauty for Every Version of You",
        subtitle:
          "Discover everyday beauty essentials made for every mood, every look, and every version of you.",
        imageUrl: image,
        buttonText: "Shop Best Sellers",
        buttonLink: "/products",
        isActive: true,
      },
    });
  await prisma.campaign.upsert({
    where: { slug: "everyday-beauty-made-effortless" },
    update: {},
    create: {
      title: "Everyday Beauty, Made Effortless",
      slug: "everyday-beauty-made-effortless",
      description: "A modern beauty experience designed for every version of you.",
      imageUrl: image,
      isPublished: true,
    },
  });
  await prisma.article.upsert({
    where: { slug: "how-to-choose-your-everyday-shade" },
    update: {},
    create: {
      title: "How to Choose Your Everyday Shade",
      slug: "how-to-choose-your-everyday-shade",
      content: [
        "Identify your undertone in natural light, test colour near your face,",
        "and choose the shade that makes your skin look rested and naturally radiant.",
      ].join(" "),
      excerpt: "A simple guide to finding your everyday makeup shade.",
      imageUrl: image,
      isPublished: true,
    },
  });
}
main().finally(() => prisma.$disconnect());
