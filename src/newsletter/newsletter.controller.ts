import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { NewsletterDto } from "../common/dto";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { PrismaService } from "../prisma/prisma.service";
@Controller("newsletter")
export class NewsletterController {
  constructor(private readonly prisma: PrismaService) {}
  @Post() async subscribe(@Body() dto: NewsletterDto) {
    const data = await this.prisma.newsletterSubscriber.upsert({
      where: { email: dto.email },
      create: dto,
      update: {},
    });
    return { success: true, data };
  }
  @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) async list(
    @Query() q: Record<string, string>,
  ) {
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
    const where = q.search ? { email: { contains: q.search, mode: "insensitive" as const } } : {};
    const [data, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.newsletterSubscriber.count({ where }),
    ]);
    return { success: true, data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async remove(@Param("id") id: string) {
    await this.prisma.newsletterSubscriber.delete({ where: { id } });
    return { success: true, data: { id } };
  }
}
