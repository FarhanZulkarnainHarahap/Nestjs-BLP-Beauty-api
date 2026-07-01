import { Module } from "@nestjs/common";
import { CrudService } from "../common/crud.service";
import { BannersController } from "./banners.controller";
@Module({ controllers: [BannersController], providers: [CrudService] })
export class BannersModule {}
