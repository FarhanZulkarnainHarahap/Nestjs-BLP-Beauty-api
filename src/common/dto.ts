import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class ProductDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(10) description!: string;
  @IsNumber() @Min(0) price!: number;
  @IsOptional() @IsNumber() @Min(0) discountPrice?: number | null;
  @IsUrl() imageUrl!: string;
  @IsString() categoryId!: string;
  @IsOptional() @IsString() badge?: string | null;
  @IsInt() @Min(0) stock!: number;
  @IsBoolean() isBestSeller!: boolean;
  @IsBoolean() isPublished!: boolean;
}
export class CategoryDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsUrl() imageUrl?: string;
}
export class BannerDto {
  @IsString() title!: string;
  @IsString() subtitle!: string;
  @IsUrl() imageUrl!: string;
  @IsString() buttonText!: string;
  @IsString() buttonLink!: string;
  @IsBoolean() isActive!: boolean;
}
export class CampaignDto {
  @IsString() title!: string;
  @IsString() @MinLength(10) description!: string;
  @IsUrl() imageUrl!: string;
  @IsOptional() @IsString() buttonText?: string;
  @IsOptional() @IsString() buttonLink?: string;
  @IsBoolean() isPublished!: boolean;
}
export class ArticleDto {
  @IsString() title!: string;
  @IsString() @MinLength(20) content!: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsUrl() imageUrl?: string;
  @IsBoolean() isPublished!: boolean;
}
export class NewsletterDto {
  @IsEmail() @Transform(({ value }) => value.toLowerCase()) email!: string;
}
export class UpdateProductDto extends PartialType(ProductDto) {}
export class UpdateCategoryDto extends PartialType(CategoryDto) {}
export class UpdateBannerDto extends PartialType(BannerDto) {}
export class UpdateCampaignDto extends PartialType(CampaignDto) {}
export class UpdateArticleDto extends PartialType(ArticleDto) {}
