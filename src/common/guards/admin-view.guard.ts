import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
@Injectable()
export class AdminViewGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.query.admin !== "true") return true;
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) throw new UnauthorizedException("Bearer token is required");
    try {
      request.user = jwt.verify(token, this.config.getOrThrow("INTERNAL_API_SECRET"), {
        algorithms: ["HS256"],
        issuer: "beauty-web",
        audience: "beauty-api",
      });
    } catch {
      throw new UnauthorizedException("Internal token is invalid or expired");
    }
    if (![Role.ADMIN, Role.SUPER_ADMIN].includes(request.user.role))
      throw new ForbiddenException("Admin role is required");
    return true;
  }
}
