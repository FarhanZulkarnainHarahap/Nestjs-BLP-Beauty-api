import { Module } from "@nestjs/common";
import { CrudService } from "../common/crud.service";
import { ArticlesController } from "./articles.controller";
@Module({ controllers: [ArticlesController], providers: [CrudService] })
export class ArticlesModule {}
