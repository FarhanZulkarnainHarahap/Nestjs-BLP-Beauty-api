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
import { ProductDto, UpdateProductDto } from "../common/dto";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AdminViewGuard } from "../common/guards/admin-view.guard";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}
  @Get() @UseGuards(AdminViewGuard) list(@Query() query: Record<string, string>) {
    return this.service.list(query);
  }
  @Get("id/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  byId(@Param("id") id: string) {
    return this.service.byId(id);
  }
  @Get(":slug") detail(@Param("slug") slug: string) {
    return this.service.bySlug(slug);
  }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) create(
    @Body() dto: ProductDto,
  ) {
    return this.service.create(dto);
  }
  @Patch(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) update(
    @Param("id") id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, dto);
  }
  @Delete(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) remove(
    @Param("id") id: string,
  ) {
    return this.service.remove(id);
  }
}
