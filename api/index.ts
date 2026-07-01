import type { Request, Response } from "express";
import express from "express";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "../src/app.module";
import { configureApplication } from "../src/bootstrap";

type ExpressServer = ReturnType<typeof express>;

let cachedServer: ExpressServer | undefined;

async function getServer() {
  if (cachedServer) return cachedServer;

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: process.env.NODE_ENV === "production" ? ["error", "warn"] : undefined,
  });

  configureApplication(app);
  await app.init();

  cachedServer = server;
  return server;
}

export default async function handler(request: Request, response: Response) {
  const server = await getServer();
  return server(request, response);
}
