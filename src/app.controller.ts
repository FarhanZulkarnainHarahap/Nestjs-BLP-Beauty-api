import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  index() {
    return {
      success: true,
      data: {
        service: "beauty-nest-api",
        status: "ok",
        health: "/health",
      },
    };
  }

  @Get("health")
  health() {
    return {
      success: true,
      data: { service: "beauty-nest-api", status: "ok" },
    };
  }
}
