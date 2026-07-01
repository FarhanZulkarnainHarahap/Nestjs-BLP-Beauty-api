import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { IsEnum } from "class-validator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { PrismaService } from "../prisma/prisma.service";
class RoleDto {
  @IsEnum(Role) role!: Role;
}
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() async list() {
    const data = await this.prisma.user.findMany({
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  }
  @Patch(":id/role") async role(@Param("id") id: string, @Body() dto: RoleDto) {
    const data = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, email: true, role: true },
    });
    return { success: true, data };
  }
  @Delete(":id") async remove(@Param("id") id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { success: true, data: { id } };
  }
}
