import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "./utils/slug";

export type Resource = "category" | "banner" | "campaign" | "article";
type Delegate = {
  findMany(a: object): Promise<unknown[]>;
  count(a: object): Promise<number>;
  findUnique(a: object): Promise<unknown>;
  findFirst(a: object): Promise<unknown>;
  create(a: object): Promise<unknown>;
  update(a: object): Promise<unknown>;
  delete(a: object): Promise<unknown>;
};

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) {}
  private model(resource: Resource) {
    return this.prisma[resource] as unknown as Delegate;
  }
  async list(resource: Resource, query: Record<string, string>, publicWhere: object = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const field = resource === "category" ? "name" : "title";
    const where = {
      ...(query.admin === "true" ? {} : publicWhere),
      ...(query.search ? { [field]: { contains: query.search, mode: "insensitive" } } : {}),
    };
    const [data, total] = await Promise.all([
      this.model(resource).findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.model(resource).count({ where }),
    ]);
    return { success: true, data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }
  async detail(resource: Resource, slug: string) {
    const published =
      resource === "campaign" || resource === "article" ? { isPublished: true } : {};
    const data = await this.model(resource).findFirst({ where: { slug, ...published } });
    if (!data) throw new NotFoundException("Record not found");
    return { success: true, data };
  }
  async byId(resource: Resource, id: string) {
    const data = await this.model(resource).findUnique({ where: { id } });
    if (!data) throw new NotFoundException("Record not found");
    return { success: true, data };
  }
  create(resource: Resource, dto: object, slug = false) {
    const values = dto as Record<string, unknown>;
    const label = String(values.name ?? values.title ?? "");
    return this.model(resource)
      .create({ data: { ...values, ...(slug ? { slug: slugify(label) } : {}) } })
      .then((data) => ({ success: true, data }));
  }
  update(resource: Resource, id: string, dto: object, slug = false) {
    const values = dto as Record<string, unknown>;
    const label = values.name ?? values.title;
    return this.model(resource)
      .update({
        where: { id },
        data: { ...values, ...(slug && label ? { slug: slugify(String(label)) } : {}) },
      })
      .then((data) => ({ success: true, data }));
  }
  remove(resource: Resource, id: string) {
    return this.model(resource)
      .delete({ where: { id } })
      .then(() => ({ success: true, data: { id } }));
  }
}
