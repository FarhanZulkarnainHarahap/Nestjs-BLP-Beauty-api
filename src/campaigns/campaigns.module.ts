import { Module } from "@nestjs/common";
import { CrudService } from "../common/crud.service";
import { CampaignsController } from "./campaigns.controller";
@Module({ controllers: [CampaignsController], providers: [CrudService] })
export class CampaignsModule {}
