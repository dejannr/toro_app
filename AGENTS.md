# AGENTS.md

## Project Identity

This repository is the foundation for a trucking SaaS application.

The future product will create invoices from BOLs and Rate Confirmations, but the current implementation phase is limited to the app shell, authentication system, and required pages.

## Current Scope

Build only:

- App structure
- Authentication system
- Public auth pages
- Protected blank pages
- Empty example homepage
- Local development setup

Do not implement trucking SaaS business logic yet.

## Required Stack

Frontend:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

Backend:

- FastAPI
- Python 3.12+
- Pydantic v2
- SQLAlchemy 2 async ORM
- Alembic

Infrastructure:

- PostgreSQL
- Redis
- Docker Compose

Authentication:

- Custom email/password auth
- Argon2 password hashing
- JWT access and refresh tokens
- HttpOnly secure cookies

## Hard Boundaries

Do not add implementation for:

- BOL processing
- Rate Confirmation processing
- Invoice generation
- Load management
- Carrier management
- Broker management
- Driver management
- Dispatching
- Payments
- Accounting
- OCR
- PDF parsing
- File upload workflows
- Subscription billing
- Company/team roles

These features belong to later phases.

## Required Pages

Public:

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Protected:

- `/dashboard`
- `/account`

Auth action:

- `/logout`

The homepage and dashboard should remain minimal and mostly empty.

## Repository Structure

Use this monorepo layout:

```txt
repo-root/
├── apps/
│   ├── frontend/
│   └── backend/
├── docker-compose.yml
├── .env.example
├── README.md
└── AGENTS.md
```

Frontend code belongs in `apps/frontend`.

Backend code belongs in `apps/backend`.

Do not mix backend business logic into the frontend.
Do not place frontend code in the backend app.

## Backend Structure

FastAPI code should follow this structure:

```txt
apps/backend/app/
├── main.py
├── core/
├── db/
├── models/
├── schemas/
├── api/
│   └── routes/
└── services/
```

Use service modules for auth logic.
Use route modules only for request/response handling.
Use schema modules for Pydantic models.
Use model modules for SQLAlchemy models.

## Frontend Structure

Next.js code should follow this structure:

```txt
apps/frontend/
├── app/
├── components/
├── lib/
└── middleware.ts
```

Use `app/` for routes.
Use `components/auth` for auth-specific UI.
Use `components/layout` for layout components.
Use `components/ui` for shadcn/ui components.
Use `lib/api.ts` for the base API client.
Use `lib/auth.ts` for auth helpers.
Use `lib/validations` for Zod schemas.

## Coding Rules

- Use TypeScript on the frontend.
- Use Python type hints on the backend.
- Keep code modular and simple.
- Do not introduce premature abstractions.
- Do not add SaaS business entities until explicitly requested.
- Do not add mock trucking data.
- Do not add sample invoice data.
- Do not add upload flows.
- Do not add OCR/PDF dependencies.
- Keep UI minimal.

## Auth Rules

- Tokens must be stored in HttpOnly cookies.
- Do not store JWT tokens in localStorage or sessionStorage.
- Passwords must be hashed with Argon2.
- Use environment variables for secrets.
- Do not hardcode secrets.
- Keep protected pages inaccessible without authentication.

## Environment Rules

Use `.env.example` for documented environment variables.
Do not commit real `.env` files.

Required variables include:

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

## Testing Rules

Backend tests should use Pytest.
Frontend test setup may be minimal for now.
Do not create heavy end-to-end tests until requested.

## Migration Rules

Use Alembic for database migrations.
Create an initial migration for the `users` table only.
Do not add tables for trucking entities yet.

## Future Phase Reminder

Future phases may include:

- Company accounts
- Team roles
- BOL upload
- Rate Con upload
- Invoice generation
- PDF extraction
- Integrations
- Billing

Do not implement these until explicitly instructed.
