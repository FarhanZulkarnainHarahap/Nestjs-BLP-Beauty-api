import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
@Controller("upload")
export class UploadController {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get("CLOUDINARY_CLOUD_NAME"),
      api_key: config.get("CLOUDINARY_API_KEY"),
      api_secret: config.get("CLOUDINARY_API_SECRET"),
    });
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 4 * 1024 * 1024, files: 1, fields: 0, parts: 1 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Image file is required");
    if (!this.config.get("CLOUDINARY_CLOUD_NAME"))
      throw new ServiceUnavailableException("Cloudinary credentials are not configured");
    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "beauty-cms" }, (error, result) =>
        error || !result ? reject(error) : resolve(result.secure_url),
      );
      stream.end(file.buffer);
    });
    return { success: true, data: { url } };
  }
}
