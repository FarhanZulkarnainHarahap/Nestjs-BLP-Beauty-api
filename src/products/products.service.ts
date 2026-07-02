import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ProductDto, UpdateProductDto } from "../common/dto";
import { slugify } from "../common/utils/slug";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async list(query: Record<string, string>) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const where: Prisma.ProductWhereInput = {
      ...(query.admin === "true" ? {} : { isPublished: true }),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.bestSeller === "true" ? { isBestSeller: true } : {}),
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === "price-asc"
        ? { price: "asc" }
        : query.sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" };
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);
    return { success: true, data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }
  async bySlug(slug: string) {
    const data = await this.prisma.product.findFirst({
      where: { slug, isPublished: true },
      include: { category: true },
    });
    if (!data) throw new NotFoundException("Product not found");
    return { success: true, data };
  }
  async byId(id: string) {
    const data = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!data) throw new NotFoundException("Product not found");
    return { success: true, data };
  }
  create(dto: ProductDto) {
    return this.prisma.product
      .create({ data: { ...dto, slug: slugify(dto.name) }, include: { category: true } })
      .then((data) => ({ success: true, data }));
  }
  update(id: string, dto: UpdateProductDto) {
    return this.prisma.product
      .update({
        where: { id },
        data: { ...dto, ...(dto.name ? { slug: slugify(dto.name) } : {}) },
        include: { category: true },
      })
      .then((data) => ({ success: true, data }));
  }
  remove(id: string) {
    return this.prisma.product
      .delete({ where: { id } })
      .then(() => ({ success: true, data: { id } }));
  }
}
