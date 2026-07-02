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
import { BannerDto, UpdateBannerDto } from "../common/dto";
import { CrudService } from "../common/crud.service";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AdminViewGuard } from "../common/guards/admin-view.guard";
@Controller("banners")
export class BannersController {
  constructor(private readonly service: CrudService) {}
  @Get() @UseGuards(AdminViewGuard) list(@Query() query: Record<string, string>) {
    return this.service.list("banner", query, { isActive: true });
  }
  @Get("id/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  byId(@Param("id") id: string) {
    return this.service.byId("banner", id);
  }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) create(
    @Body() dto: BannerDto,
  ) {
    return this.service.create("banner", dto);
  }
  @Patch(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) update(
    @Param("id") id: string,
    @Body() dto: UpdateBannerDto,
  ) {
    return this.service.update("banner", id, dto);
  }
  @Delete(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) remove(
    @Param("id") id: string,
  ) {
    return this.service.remove("banner", id);
  }
}
