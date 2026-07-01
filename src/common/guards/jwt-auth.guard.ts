import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) throw new UnauthorizedException("Bearer token is required");
    try {
      const user = jwt.verify(token, this.config.getOrThrow("INTERNAL_API_SECRET"), {
        algorithms: ["HS256"],
        issuer: "beauty-web",
        audience: "beauty-api",
      });
      if (typeof user === "string" || user.type !== "internal-api") throw new Error();
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException("Internal token is invalid or expired");
    }
  }
}
