import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Role } from "@prisma/client";
import { authenticateRequest } from "../../auth/auth-user";
@Injectable()
export class AdminViewGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.query.admin !== "true") return true;
    await authenticateRequest(request, this.config.getOrThrow("INTERNAL_API_SECRET"));
    if (![Role.ADMIN, Role.SUPER_ADMIN].includes(request.user.role))
      throw new ForbiddenException("Admin role is required");
    return true;
  }
}
