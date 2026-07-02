import { UnauthorizedException } from "@nestjs/common";
import type { Role } from "@prisma/client";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { getBackendSession } from "./auth.runtime";

export type AuthenticatedUser = {
  sub: string;
  email?: string;
  role: Role;
  type: "internal-api";
};

export async function authenticateRequest(
  request: Request & { user?: AuthenticatedUser },
  internalSecret: string,
) {
  const [scheme, token] = request.headers.authorization?.split(" ") ?? [];

  if (scheme === "Bearer" && token) {
    try {
      const user = jwt.verify(token, internalSecret, {
        algorithms: ["HS256"],
        issuer: "beauty-web",
        audience: "beauty-api",
      });
      if (typeof user === "string" || user.type !== "internal-api") throw new Error();
      request.user = user as AuthenticatedUser;
      return request.user;
    } catch {
      throw new UnauthorizedException("Internal token is invalid or expired");
    }
  }

  try {
    const session = await getBackendSession(request);
    const user = session?.user as { id?: string; email?: string | null; role?: Role } | undefined;
    if (user?.id && user.role) {
      request.user = {
        sub: user.id,
        email: user.email ?? undefined,
        role: user.role,
        type: "internal-api",
      };
      return request.user;
    }
  } catch {
    // Convert Auth.js errors to a stable API authentication response.
  }

  throw new UnauthorizedException("Authentication is required");
}
