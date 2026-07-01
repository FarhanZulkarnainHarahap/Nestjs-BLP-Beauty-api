# Beauty API — NestJS on Bun

REST API contract equivalent to the Express backend, built with NestJS, Prisma/PostgreSQL, class-validator DTOs, JWT/role guards, a global exception filter, and Cloudinary upload.

## Setup with Bun

1. Install Bun from [bun.sh](https://bun.sh).
2. `bun install`
3. Copy `.env.example` to `.env` and fill all values.
4. `bun run db:generate`
5. `bun run db:migrate`
6. `bun run db:seed`
7. `bun run start:dev`

Use the same database and `INTERNAL_API_SECRET` as `web`. Switch the frontend with `NEXT_PUBLIC_API_URL=http://localhost:5000`.

## Commands

- `bun run start:dev`
- `bun run build`
- `bun run db:migrate`
- `bun run db:seed`

## API

Routes match Express: `/auth`, `/products`, `/categories`, `/banners`, `/campaigns`, `/articles`, `/newsletter`, `/upload`, and `/users`. Public GET routes expose published content. Admin list mode (`?admin=true`) and every mutation validate a short-lived internal JWT. Content writes require `ADMIN` or `SUPER_ADMIN`; user management requires `SUPER_ADMIN`.

To test locally, run the API and request `GET http://localhost:5000/products`. Verify unauthenticated `POST /products` returns 401 and that a valid Super Admin token can access `GET /users`.

## Vercel

`api/index.ts` menginisialisasi dan menyimpan cache Nest application tanpa membuka port. Vercel
menjalankannya melalui Express adapter pada runtime Node.js yang stabil; workflow development lokal
tetap memakai Bun. Pilih `bun.js-nest.js` sebagai Root Directory. Detail environment dan urutan
deployment tersedia di
[repository frontend](https://github.com/FarhanZulkarnainHarahap/BLP-Beauty/blob/main/VERCEL_DEPLOYMENT.md).
