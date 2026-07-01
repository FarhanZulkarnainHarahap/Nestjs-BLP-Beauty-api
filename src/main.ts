import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApplication } from "./bootstrap";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = configureApplication(app);
  const port = config.get<number>("PORT", 5000);

  await app.listen(port);
  console.log(`Nest Bun API listening on http://localhost:${port}`);
}

void bootstrap();
