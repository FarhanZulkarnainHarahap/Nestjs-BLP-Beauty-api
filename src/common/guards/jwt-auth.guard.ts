import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { authenticateRequest } from "../../auth/auth-user";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    await authenticateRequest(request, this.config.getOrThrow("INTERNAL_API_SECRET"));
    return true;
  }
}
