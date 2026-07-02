# Beauty API — NestJS on Bun

REST API contract equivalent to the Express backend, built with NestJS, Prisma/PostgreSQL, class-validator DTOs, JWT/role guards, a global exception filter, and Cloudinary upload.

## Setup with Bun

1. Install Bun from [bun.sh](https://bun.sh).
2. `bun install`
3. Copy `.env.example` to `.env`, use the pooled PostgreSQL URL as `DATABASE_URL`, the direct URL as
   `DIRECT_URL`, and fill the remaining values.
4. `bun run db:generate`
5. `bun run db:migrate`
6. `bun run db:seed`
7. `bun run start:dev`

Use the same database and `INTERNAL_API_SECRET` as `web`. Set the frontend
`NEXT_PUBLIC_API_URL` to this backend's production URL.

## Commands

- `bun run start:dev`
- `bun run build`
- `bun run db:migrate`
- `bun run db:deploy`
- `bun run db:seed`

## API

| Resource   | Routes                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Status     | `GET /`, `GET /health`                                                                              |
| Auth.js    | `/api/auth/providers`, `/api/auth/session`, OAuth callbacks, sign-in, and sign-out                  |
| Auth       | `GET /auth/me`, `POST /auth/internal-token/verify`                                                  |
| Products   | `GET /products`, `GET /products/:slug`, `GET /products/id/:id`, `POST/PATCH/DELETE /products[/:id]` |
| Categories | `GET /categories`, `GET /categories/id/:id`, `POST/PATCH/DELETE /categories[/:id]`                  |
| Banners    | `GET /banners`, `GET /banners/id/:id`, `POST/PATCH/DELETE /banners[/:id]`                           |
| Campaigns  | `GET /campaigns`, `GET /campaigns/:slug`, `GET /campaigns/id/:id`, mutations by ID                  |
| Articles   | `GET /articles`, `GET /articles/:slug`, `GET /articles/id/:id`, mutations by ID                     |
| Newsletter | `POST/GET /newsletter`, `DELETE /newsletter/:id`                                                    |
| Upload     | `POST /upload` (`multipart/form-data`, field `file`)                                                |
| Users      | `GET /users`, `PATCH /users/:id/role`, `DELETE /users/:id`                                          |

Public GET routes expose published content. Admin detail/list routes and every mutation validate a
backend Auth.js database session or a short-lived internal JWT. Content writes require `ADMIN` or
`SUPER_ADMIN`; user management requires `SUPER_ADMIN`.

Set `API_URL` to the deployed backend URL, then request `GET $API_URL/health`. Verify an
unauthenticated `POST $API_URL/products` returns 401 and that a valid Super Admin token can access
`GET $API_URL/users`.

## Vercel

Vercel mendeteksi `src/main.ts` sebagai NestJS entrypoint dan menjalankannya sebagai satu Vercel
Function. Pilih `bun.js-nest.js` sebagai Root Directory dan jangan isi Build Command atau Output
Directory secara manual.

Isi `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `INTERNAL_API_SECRET`, `AUTH_SECRET`,
`AUTH_TRUST_HOST`, seluruh credential OAuth,
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, dan `FRONTEND_URL` untuk
Production dan Preview. Jalankan `bun run db:deploy` sekali untuk menerapkan migration. Detail urutan
deployment tersedia di
[repository frontend](https://github.com/FarhanZulkarnainHarahap/BLP-Beauty/blob/main/VERCEL_DEPLOYMENT.md).
