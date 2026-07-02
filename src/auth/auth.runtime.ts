import type { ExpressAuthConfig } from "@auth/express";
import type { Role } from "@prisma/client";
import type { Request, RequestHandler } from "express";
import { prisma } from "../config/prisma";

type ExpressAuthModule = typeof import("@auth/express");
type PrismaAdapterModule = typeof import("@auth/prisma-adapter");
type GoogleModule = typeof import("@auth/express/providers/google");
type FacebookModule = typeof import("@auth/express/providers/facebook");

const nativeImport = new Function("specifier", "return import(specifier)") as <T>(
  specifier: string,
) => Promise<T>;

async function createAuthRuntime() {
  const [expressAuth, prismaAdapter, google, facebook] = await Promise.all([
    nativeImport<ExpressAuthModule>("@auth/express"),
    nativeImport<PrismaAdapterModule>("@auth/prisma-adapter"),
    nativeImport<GoogleModule>("@auth/express/providers/google"),
    nativeImport<FacebookModule>("@auth/express/providers/facebook"),
  ]);
  const frontendOrigin = (process.env.FRONTEND_URL ?? "").split(",")[0]!.trim();
  const config: ExpressAuthConfig = {
    adapter: prismaAdapter.PrismaAdapter(prisma),
    basePath: "/api/auth",
    secret: process.env.AUTH_SECRET ?? process.env.JWT_SECRET,
    trustHost: true,
    providers: [
      google.default({ allowDangerousEmailAccountLinking: true }),
      facebook.default({ allowDangerousEmailAccountLinking: true }),
    ],
    pages: { signIn: `${frontendOrigin}/login` },
    session: { strategy: "database" },
    callbacks: {
      session({ session, user }) {
        const sessionUser = session.user as typeof session.user & { id: string; role: Role };
        sessionUser.id = user.id;
        sessionUser.role = (user as typeof user & { role: Role }).role;
        return session;
      },
    },
  };

  return {
    config,
    middleware: expressAuth.ExpressAuth(config),
    getSession: (request: Request) => expressAuth.getSession(request, config),
  };
}

let authRuntime: ReturnType<typeof createAuthRuntime> | undefined;

function getAuthRuntime() {
  authRuntime ??= createAuthRuntime();
  return authRuntime;
}

export const authHandler: RequestHandler = (request, response, next) => {
  const forwardedHost = request.headers["x-forwarded-host"];
  if (typeof forwardedHost === "string") request.headers.host = forwardedHost.split(",")[0]!.trim();
  void getAuthRuntime()
    .then(({ middleware }) => middleware(request, response, next))
    .catch(next);
};

export async function getBackendSession(request: Request) {
  const runtime = await getAuthRuntime();
  return runtime.getSession(request);
}
