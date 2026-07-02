import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { CategoryDto, UpdateCategoryDto } from "../common/dto";
import { CrudService } from "../common/crud.service";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AdminViewGuard } from "../common/guards/admin-view.guard";
@Controller("categories")
export class CategoriesController {
  constructor(private readonly service: CrudService) {}
  @Get() @UseGuards(AdminViewGuard) list(@Query() query: Record<string, string>) {
    return this.service.list("category", query);
  }
  @Get("id/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  byId(@Param("id") id: string) {
    return this.service.byId("category", id);
  }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) create(
    @Body() dto: CategoryDto,
  ) {
    return this.service.create("category", dto, true);
  }
  @Patch(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update("category", id, dto, true);
  }
  @Delete(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) remove(
    @Param("id") id: string,
  ) {
    return this.service.remove("category", id);
  }
}
