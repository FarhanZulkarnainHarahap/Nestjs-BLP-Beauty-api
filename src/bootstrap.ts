import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { authHandler } from "./auth/auth.runtime";

export function configureApplication(app: INestApplication) {
  const config = app.get(ConfigService);
  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  const allowedOrigins = (config.get<string>("FRONTEND_URL") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  app.enableCors({
    origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"), false);
    },
    credentials: true,
  });
  app.use("/api/auth", authHandler);
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
