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
import { ArticleDto, UpdateArticleDto } from "../common/dto";
import { CrudService } from "../common/crud.service";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AdminViewGuard } from "../common/guards/admin-view.guard";
@Controller("articles")
export class ArticlesController {
  constructor(private readonly service: CrudService) {}
  @Get() @UseGuards(AdminViewGuard) list(@Query() q: Record<string, string>) {
    return this.service.list("article", q, { isPublished: true });
  }
  @Get("id/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  byId(@Param("id") id: string) {
    return this.service.byId("article", id);
  }
  @Get(":slug") detail(@Param("slug") slug: string) {
    return this.service.detail("article", slug);
  }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) create(
    @Body() dto: ArticleDto,
  ) {
    return this.service.create("article", dto, true);
  }
  @Patch(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) update(
    @Param("id") id: string,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.service.update("article", id, dto, true);
  }
  @Delete(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN) remove(
    @Param("id") id: string,
  ) {
    return this.service.remove("article", id);
  }
}
