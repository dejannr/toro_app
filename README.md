# Trucking SaaS App Foundation

This repository contains the initial foundation for a trucking SaaS application.
The future product will create invoices from BOLs and Rate Confirmations, but this
phase intentionally includes only the app shell, authentication system, required
pages, and local development setup.

## Current Scope

- Monorepo app structure
- FastAPI backend with custom email/password authentication
- Next.js App Router frontend with public and protected pages
- PostgreSQL, Redis, and Docker Compose setup
- Alembic migration for the `users` table

Trucking, invoice, document-processing, workflow, billing, and accounting logic is
intentionally not implemented yet.

## Stack

Frontend:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- React Hook Form
- Zod

Backend:

- FastAPI
- Python 3.12+
- Pydantic v2
- SQLAlchemy 2 async ORM
- Alembic
- Argon2 password hashing
- JWT access and refresh tokens in HttpOnly cookies

Infrastructure:

- PostgreSQL
- Redis
- Docker Compose

## Environment

Copy `.env.example` to `.env` for local development and replace placeholder
values before using a non-local environment.

Required variables:

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
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Docker Compose

Run the full local stack:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

Run backend migrations inside the backend container:

```bash
docker compose run --rm backend alembic upgrade head
```

## Run Script

The root `run.sh` script starts the backend and frontend in one terminal:

```bash
./run.sh setup
./run.sh
```

Logs stream directly in the terminal. Press `Ctrl+C` to stop both processes.

PostgreSQL and Redis must be running separately for authentication flows that
touch the database or cache.

## Frontend Commands

```bash
cd apps/frontend
npm install
npm run dev
npm run typecheck
npm run lint
```

## Backend Commands

```bash
cd apps/backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
pytest
ruff check .
black --check .
```

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

The homepage and dashboard are intentionally minimal.
