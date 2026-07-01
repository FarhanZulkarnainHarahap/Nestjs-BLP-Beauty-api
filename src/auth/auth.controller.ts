import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
@Controller("auth")
@UseGuards(JwtAuthGuard)
export class AuthController {
  @Get("me") me(@Req() req: { user: unknown }) {
    return { success: true, data: req.user };
  }
  @Post("internal-token/verify") verify(@Req() req: { user: unknown }) {
    return { success: true, data: { valid: true, user: req.user } };
  }
}
