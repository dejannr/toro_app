# Codex Instructions: Trucking SaaS App Foundation

## Project Goal

Create the initial structure for a trucking SaaS application.

The application will eventually create invoices from BOLs and Rate Confirmations, but **do not implement any trucking, invoice, BOL, Rate Con, load, carrier, broker, payment, or document-processing logic yet**.

For this phase, build only:

1. The app foundation.
2. The authentication system.
3. The required public and protected pages.
4. An empty example homepage.
5. A repo-level `AGENTS.md` file so future Codex runs understand the app structure and boundaries.

---

## Required Stack

Use the following stack:

### Frontend

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### Backend

- FastAPI
- Python 3.12+
- Pydantic v2
- SQLAlchemy 2 async ORM
- Alembic migrations

### Database and Cache

- PostgreSQL
- Redis

### Authentication

- Custom email/password authentication in FastAPI
- Argon2 password hashing
- JWT access token and refresh token
- HttpOnly secure cookies
- Protected routes handled by Next.js middleware

### Local Development

- Docker Compose
- Services:
  - `frontend`
  - `backend`
  - `postgres`
  - `redis`

### Code Quality

- Backend:
  - Ruff
  - Black
  - Pytest
- Frontend:
  - ESLint
  - Prettier
  - TypeScript strict mode

---

## Important Scope Rules

This phase is only for the app shell and authentication system.

Do **not** create any business logic for:

- BOLs
- Rate Confirmations
- Invoices
- Loads
- Carriers
- Brokers
- Customers
- Drivers
- Dispatching
- Payments
- File parsing
- OCR
- PDF processing
- Accounting
- Trucking workflow logic

You may create placeholder folders for future app modules only if they are clearly empty and documented as future-use placeholders.

Do not create fake trucking data, fake invoice screens, fake BOL upload forms, or fake Rate Con examples.

---

## Required Pages

Create only these pages for now:

### Public Pages

- `/`
  - Empty example homepage.
  - No marketing copy.
  - No trucking content.
  - Minimal placeholder layout only.

- `/login`
  - Email/password login form.

- `/register`
  - Basic account registration form.

- `/forgot-password`
  - Email input form for password reset request.

- `/reset-password`
  - Password reset form.

### Protected Pages

- `/dashboard`
  - Protected blank dashboard page.
  - No SaaS app logic.
  - No trucking widgets.

- `/account`
  - Protected basic account page.
  - May show authenticated user email.
  - No billing, subscription, or company logic yet.

### Auth Action

- `/logout`
  - Logout route/action that clears authentication cookies/session.

---

## Recommended Repository Structure

Create a monorepo-style repository:

```txt
repo-root/
├── AGENTS.md
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── apps/
│   ├── frontend/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── account/
│   │   │   │   └── page.tsx
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── validations/
│   │   ├── middleware.ts
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   │
│   └── backend/
│       ├── app/
│       │   ├── main.py
│       │   ├── core/
│       │   │   ├── config.py
│       │   │   ├── security.py
│       │   │   └── redis.py
│       │   ├── db/
│       │   │   ├── base.py
│       │   │   ├── session.py
│       │   │   └── migrations/
│       │   ├── models/
│       │   │   └── user.py
│       │   ├── schemas/
│       │   │   └── auth.py
│       │   ├── api/
│       │   │   ├── deps.py
│       │   │   └── routes/
│       │   │       ├── auth.py
│       │   │       └── health.py
│       │   └── services/
│       │       └── auth_service.py
│       ├── tests/
│       ├── alembic.ini
│       ├── pyproject.toml
│       └── Dockerfile
```

---

## Authentication Requirements

Implement authentication as a clean foundation only.

### User Model

Create a minimal `User` model with:

- `id`
- `email`
- `hashed_password`
- `is_active`
- `is_verified`
- `created_at`
- `updated_at`

Do not add company, role, subscription, trucking, carrier, or billing fields yet.

### Backend Auth Endpoints

Create these backend routes:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`
- `GET /health`

### Cookie Requirements

Use HttpOnly cookies for auth tokens.

Recommended cookie names:

- `access_token`
- `refresh_token`

Cookie settings should be environment-aware:

- Secure cookies in production.
- SameSite setting configurable.
- Do not expose tokens to frontend JavaScript.

### Password Requirements

- Hash passwords using Argon2.
- Never store plain text passwords.
- Validate passwords with a basic minimum length rule.
- Do not implement advanced password policy yet unless necessary.

### Password Reset Requirements

Create the endpoint and page structure only.

For now:

- Generate secure reset tokens.
- Store token hashes server-side or in Redis with expiration.
- Do not integrate email delivery yet.
- Add TODO comments for future email provider integration.

---

## Frontend Requirements

### General

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use shadcn/ui components where appropriate.
- Keep pages visually clean and minimal.
- Avoid marketing content.
- Avoid trucking content for now.

### Forms

Use:

- React Hook Form
- Zod validation

Create validation schemas for:

- Login
- Register
- Forgot password
- Reset password

### API Client

Create a small API client in:

```txt
apps/frontend/lib/api.ts
```

It should:

- Use `fetch`.
- Include credentials.
- Handle basic JSON responses.
- Avoid business-specific helpers.

### Auth Helper

Create auth helpers in:

```txt
apps/frontend/lib/auth.ts
```

They may include:

- `getCurrentUser`
- `login`
- `register`
- `logout`
- `requestPasswordReset`
- `resetPassword`

Do not add app-specific role or permission logic yet.

### Protected Routes

Create `middleware.ts` to protect:

- `/dashboard`
- `/account`

Unauthenticated users should be redirected to `/login`.

Authenticated users visiting `/login` or `/register` may be redirected to `/dashboard` if auth state can be verified safely.

---

## Backend Requirements

### FastAPI App

Create the FastAPI app in:

```txt
apps/backend/app/main.py
```

Include:

- CORS configuration
- Health route
- Auth routes
- Database startup checks if appropriate

### Configuration

Use environment-based config in:

```txt
apps/backend/app/core/config.py
```

Required environment variables:

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

### Database

Use async SQLAlchemy with PostgreSQL.

Create:

- Database session helper
- Declarative base
- User model
- Initial Alembic migration

### Redis

Use Redis for:

- Password reset token storage
- Optional refresh token/session tracking

Do not use Redis for app business logic yet.

---

## Docker Compose Requirements

Create `docker-compose.yml` with:

- frontend service on port `3000`
- backend service on port `8000`
- postgres service on port `5432`
- redis service on port `6379`

Use named volumes for:

- Postgres data
- Redis data if needed

---

## README Requirements

Create a basic `README.md` with:

- Project overview
- Current scope
- Stack
- Local setup instructions
- Environment variable instructions
- Commands to run frontend
- Commands to run backend
- Docker Compose instructions
- Clear note that trucking/invoice logic is intentionally not implemented yet

---

## Required AGENTS.md

Create this file at the repository root:

```md
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
```

---

## Implementation Order

Follow this order:

1. Create repository structure.
2. Create root config files.
3. Create Docker Compose setup.
4. Create backend FastAPI app.
5. Create database config and user model.
6. Create Alembic setup and initial migration.
7. Create auth security utilities.
8. Create auth routes and schemas.
9. Create frontend Next.js app.
10. Create auth pages and protected pages.
11. Create middleware route protection.
12. Create README.
13. Create `AGENTS.md`.
14. Run formatting/linting where possible.
15. Ensure no trucking business logic was added.

---

## Final Validation Checklist

Before finishing, verify:

- `AGENTS.md` exists at repo root.
- The repo uses the requested stack.
- Docker Compose includes frontend, backend, Postgres, and Redis.
- Backend has health and auth routes.
- Frontend has all required pages.
- Protected routes are protected.
- Tokens are not stored in localStorage/sessionStorage.
- Passwords are hashed with Argon2.
- `.env.example` exists.
- README explains setup.
- No BOL logic exists.
- No Rate Con logic exists.
- No invoice logic exists.
- No trucking workflow logic exists.
- Homepage is empty/minimal.
- Dashboard is blank/protected.
