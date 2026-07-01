import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

export function configureApplication(app: INestApplication) {
  const config = app.get(ConfigService);
  const allowedOrigins = config
    .get<string>("FRONTEND_URL", "http://localhost:3000")
    .split(",")
    .map((value) => value.trim());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  return config;
}
