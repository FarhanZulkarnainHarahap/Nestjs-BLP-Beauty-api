import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { BannersModule } from "./banners/banners.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { ArticlesModule } from "./articles/articles.module";
import { NewsletterModule } from "./newsletter/newsletter.module";
import { UploadModule } from "./upload/upload.module";
import { UsersModule } from "./users/users.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    BannersModule,
    CampaignsModule,
    ArticlesModule,
    NewsletterModule,
    UploadModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
