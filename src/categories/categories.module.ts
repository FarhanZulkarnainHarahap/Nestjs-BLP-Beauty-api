import { Module } from "@nestjs/common";
import { CrudService } from "../common/crud.service";
import { CategoriesController } from "./categories.controller";
@Module({ controllers: [CategoriesController], providers: [CrudService] })
export class CategoriesModule {}
