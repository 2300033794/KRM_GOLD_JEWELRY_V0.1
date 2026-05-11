# KRM_GOLD_JEWELRY_V0.1

Full-stack Gold Jewellery Business Website.

## Structure

- `swarnashop/frontend` — Next.js 16 App Router + TypeScript + Tailwind CSS v4
- `swarnashop/backend` — NestJS API + Prisma schema

## Run locally

### Frontend

```bash
cd swarnashop/frontend
npm install
npm run dev
```

### Backend

```bash
cd swarnashop/backend
cp .env.example .env
npm install
npx prisma generate
npm run start:dev
```

## Validation

- Frontend: `npm run lint && npm run test && npm run build`
- Backend: `npm run lint && npm test && npm run build`
